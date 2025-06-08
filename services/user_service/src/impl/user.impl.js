const grpc = require('@grpc/grpc-js');

const supabase = require('../utils/supabaseClient');
const prisma = require('../utils/prismaClient');

const { UserInfoResponse, UserProfileResponse, Tag } = require('../../proto/user_pb');

exports.getUserInfo = async (call, callback) => {
  const { userId } = call.request.toObject();
  try {
    // user情報の取得
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    if (userError || !userData?.user) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'User not found.'
      });
    }
    // profilesテーブルからデータを取得
    const profileData = await prisma.profile.findUnique({ where: { userId: userId } });
    if (!profileData) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'Profile not found'
      });
    }

    const response = new UserInfoResponse();
    response.setId(userData.user.id);
    response.setEmail(userData.user.email);
    response.setName(userData.user.user_metadata.displayName);
    response.setAvatarUrl(profileData.avatar_url);
    response.setPostCount(profileData.post_count);
    response.setThanksReceived(profileData.thanks_received);
    response.setCreatedAt(userData.user.created_at);
    profileData.followed_tags?.forEach((tag) => {
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
  console.log(userId, name, avatarUrl);

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
    const newProfile = await prisma.profile.upsert({
      where: { userId: userId },
      update: {
        avatar_url: avatarUrl,
      },
      create: {
        userId: userId,
        avatar_url: avatarUrl,
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