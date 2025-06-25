const grpc = require('@grpc/grpc-js');

const supabase = require('../utils/supabaseClient');
const prisma = require('../utils/prismaClient');
const redis = require('../utils/redisClient');

const { UserInfoResponse, UserProfileResponse, FollowTagResponse, GetFollowTagResponse, Tag } = require('../../proto/user_pb');

exports.getUserInfo = async (call, callback) => {
  const { userId } = call.request.toObject();
  try {
    const cached = await redis.get(`user:info:${userId}`);
    if (cached) {
      const { user, profile } = JSON.parse(cached);
      const response = new UserInfoResponse();
      response.setId(user.id);
      response.setEmail(user.email);
      response.setName(user.name);
      response.setAvatarUrl(profile.avatarUrl);
      response.setThanksReceived(profile.thanksReceived);
      response.setCreatedAt(user.createdAt);
      (profile.followedTags || []).forEach((tag) => {
        const tagItem = new Tag();
        tagItem.setId(tag.id);
        tagItem.setName(tag.name);
        response.addFollowedTagsList(tagItem);
      });
      return callback(null, response);
    }
    // user情報の取得
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    if (userError || !userData?.user) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'User not found.'
      });
    }
    // profilesテーブルからデータを取得または自動作成
    let profileData = await prisma.profile.findUnique({
      where: { userId: userId },
      include: { followed_tags: true }
    });
    if (!profileData) {
      profileData = await prisma.profile.create({
        data: { userId: userId }
      });
    }
    const cachedObj = {
      user: {
        id: userData.user.id,
        email: userData.user.email,
        name: userData.user.user_metadata.displayName,
        createdAt: userData.user.created_at,
      },
      profile: {
        avatarUrl: profileData.avatar_url,
        postCount: profileData.post_count,
        thanksReceived: profileData.thanks_received,
        followedTags: profileData.followed_tags?.map((t) => ({ id: t.id, name: t.name }))
      }
    }

    await redis.set(`user:info:${userId}`, JSON.stringify(cachedObj), 'EX', 60 * 10);

    const response = new UserInfoResponse();
    response.setId(cachedObj.user.id);
    response.setEmail(cachedObj.user.email);
    response.setName(cachedObj.user.name);
    response.setAvatarUrl(cachedObj.profile.avatarUrl);
    response.setPostCount(cachedObj.profile.postCount);
    response.setThanksReceived(cachedObj.profile.thanksReceived);
    response.setCreatedAt(cachedObj.user.createdAt);
    cachedObj.profile.followedTags?.forEach((tag) => {
      const tagItem = new Tag();
      tagItem.setId(tag.id);
      tagItem.setName(tag.name);
      response.addFollowedTagsList(tagItem);
    })
    callback(null, response);
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message
    })
  }
};

exports.updateUserProfile = async (call, callback) => {
  const { userId, name, avatarUrl } = call.request.toObject();

  try {
    const { data: userData, error: userError } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        displayName: name
      }
    });
    if (userError) {
      return callback({
        code: grpc.status.INTERNAL,
        message: '更新に失敗しました'
      });
    }

    const updateData = {};
    if (avatarUrl) {
      updateData.avatar_url = avatarUrl;
    };
    const newProfile = await prisma.profile.upsert({
      where: { userId: userId },
      update: updateData,
      create: {
        userId: userId,
        avatar_url: avatarUrl ?? null,
      }
    });

    const response = new UserInfoResponse();
    response.setId(userData.user.id);
    response.setEmail(userData.user.email);
    response.setName(userData.user.user_metadata.displayName);
    response.setAvatarUrl(newProfile.avatar_url);
    response.setPostCount(newProfile.post_count);
    response.setThanksReceived(newProfile.thanks_received);
    response.setCreatedAt(userData.user.created_at);
    newProfile.followed_tags?.map((tag) => {
      const tagItem = new Tag();
      tagItem.setId(tag.id);
      tagItem.setName(tag.name);
      response.addFollowedTagsList(tagItem);
    });
    callback(null, response);
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message
    });
  }
};

exports.createUserProfile = async (call, callback) => {
  const { userId } = call.request.toObject();

  try {
    const profile = await prisma.profile.create({
      data: {
        userId: userId
      }
    });
    const response = new UserProfileResponse();
    response.setUserId(profile.userId);
    response.setAvatarUrl(profile.avatar_url);
    response.setPostCount(profile.post_count);
    response.setThanksReceived(profile.thanks_received);
    profile.followed_tags?.map((tag) => {
      const tagItem = new Tag();
      tagItem.setId(tag.id);
      tagItem.setName(tag.name);
      response.addFollowedTagsList(tagItem);
    });
    callback(null, response);
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message
    });
  }
};

exports.followTag = async (call, callback) => {
  const { userId, tagId } = call.request.toObject();
  try {
    await redis.del(`user:followedTags:${userId}`);
    await prisma.userFollowedTag.upsert({
      where: { userId_tagId: { userId: userId, tagId: tagId } },
      update: {},
      create: { userId: userId, tagId: tagId }
    });
    const response = new FollowTagResponse();
    response.setSuccess(true);
    callback(null, response);
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message
    });
  }
};

exports.unFollowTag = async (call, callback) => {
  const { userId, tagId } = call.request.toObject();
  try {
    await redis.del(`user:followedTags:${userId}`);
    await prisma.userFollowedTag.delete({
      where: { userId_tagId: { userId: userId, tagId: tagId } }
    });
    const response = new FollowTagResponse();
    response.setSuccess(true);
    callback(null, response);
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message
    });
  }
};

exports.getFollowTag = async (call, callback) => {
  const { userId } = call.request.toObject();

  try {
    const cachedTags = await redis.get(`user:followedTags:${userId}`);
    if (cachedTags) {
      const parsed = JSON.parse(cachedTags);
      const response = new GetFollowTagResponse();
      parsed.forEach(({ id, name }) => {
        const tagItem = new Tag();
        tagItem.setId(id);
        tagItem.setName(name);
        response.addTags(tagItem);
      });
      return callback(null, response);
    };

    const followedTags = await prisma.userFollowedTag.findMany({
      where: {
        userId: userId
      },
      include: {
        tag: true
      }
    });

    const tagList = followedTags.map((t) => ({
      id: t.tag.id,
      name: t.tag.name,
    }));
    console.log('tagList =>', tagList);

    await redis.set(`user:followedTags:${userId}`, JSON.stringify(tagList), 'EX', 60 * 10);

    const response = new GetFollowTagResponse();
    tagList.forEach(({ id, name }) => {
      const tagItem = new Tag();
      tagItem.setId(id);
      tagItem.setName(name);
      response.addTags(tagItem);
    });
    callback(null, response);
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message
    });
  }
};