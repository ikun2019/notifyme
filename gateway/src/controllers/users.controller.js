const { UserIdRequest, UpdateUserRequest, FollowTagRequest, GetFollowTagRequest } = require('../../proto/user_pb');
const userServiceClient = require('../utils/grpc/userServiceClient');
const supabase = require('../utils/supabase');
// const redis = require('');

// * GET => /api/users/:userId
exports.getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const request = new UserIdRequest();
    request.setUserId(userId);
    const user = await new Promise((resolve, reject) => {
      userServiceClient.getUserInfo(request, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });

    res.status(200).json({
      id: user.getId(),
      email: user.getEmail(),
      name: user.getName(),
      avatarUrl: user.getAvatarUrl(),
      followedTags: user.getFollowedTagsList().map((tag) => ({
        id: tag.getId(),
        name: tag.getName()
      })),
      createdAt: user.getCreatedAt()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// * POST => /api/users
exports.createUser = async (req, res) => {
  const { type, table, record: { id } } = req.body;
  try {
    const request = new UserIdRequest();
    request.setUserId(id);
    const profile = await new Promise((resolve, reject) => {
      userServiceClient.createUserProfile(request, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
    res.status(200).json({
      userId: profile.getUserId(),
      avatarUrl: profile.getAvatarUrl(),
      postCount: profile.getPostCount(),
      followedTags: profile.getFollowedTagsList()?.map((tag) => ({
        id: tag.getId(),
        name: tag.getName()
      })),
      thanksReceived: profile.getThanksReceived()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// * PUT => /api/users/:userId
exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name } = req.body;
  const avatarFile = req.file;
  let avatarUrl = undefined;
  try {
    if (avatarFile) {
      const fileExt = avatarFile.originalname.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      const { error } = await supabase.storage.from('avatars').upload(`images/${fileName}`, avatarFile.buffer, {
        contentType: avatarFile.mimetype,
        upsert: true,
      });

      if (error) {
        console.error('❌ Supabase upload error:', error.message);
        return res.status(500).json({ error: 'アバターのアップロードに失敗しました' });
      }
      avatarUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/avatars/images/${fileName}`;
    }

    const request = new UpdateUserRequest();
    request.setUserId(userId);
    request.setName(name);
    if (avatarUrl !== undefined) {
      request.setAvatarUrl(avatarUrl);
    }
    const newProfile = await new Promise((resolve, reject) => {
      userServiceClient.updateUserProfile(request, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });

    res.status(200).json({
      id: newProfile.getId(),
      email: newProfile.getEmail(),
      name: newProfile.getName(),
      avatarUrl: newProfile.getAvatarUrl(),
      postCount: newProfile.getPostCount(),
      followedTags: newProfile.followedTags?.map((tag) => ({
        id: tag.getId(),
        name: tag.getName()
      })),
      thanksReceived: newProfile.getThanksReceived(),
      createdAt: newProfile.getCreatedAt()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// * POST => /api/users/follow-tag
exports.followTag = async (req, res) => {
  const { userId, tagId } = req.body;
  try {
    const request = new FollowTagRequest();
    request.setUserId(userId);
    request.setTagId(tagId);
    const result = await new Promise((resolve, reject) => {
      userServiceClient.followTag(request, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
    res.status(200).json({ success: result.getSuccess() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// * DELETE => /api/users/follow-tag
exports.unFollowTag = async (req, res) => {
  const { userId, tagId } = req.body;
  try {
    const request = new FollowTagRequest();
    request.setUserId(userId);
    request.setTagId(tagId);
    const result = await new Promise((resolve, reject) => {
      userServiceClient.unFollowTag(request, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
    res.status(200).json({ success: result.getSuccess() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// * GET => /api/users/follow-tag/:userId
exports.getFollowTag = async (req, res) => {
  const { userId } = req.params;
  try {

    const request = new GetFollowTagRequest();
    request.setUserId(userId);
    const result = await new Promise((resolve, reject) => {
      userServiceClient.getFollowTag(request, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
    const tags = result.getTagsList().map((tag) => ({
      id: tag.getId(),
      name: tag.getName()
    }));

    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};