const { UserIdRequest, UpdateUserRequest } = require('../../proto/user_pb');
const userServiceClient = require('../utils/grpc/userServiceClient');
const supabase = require('../utils/supabase');

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
      avaterUrl: user.getAvatarUrl(),
      postCount: user.getPostCount(),
      followedTags: user.getFollowedTagsList().map((tag) => ({
        id: tag.getId(),
        name: tag.getName()
      })),
      thanksReceived: user.getThanksReceived(),
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
  let avatarUrl = null;
  try {
    if (avatarFile) {
      const fileExt = avatarFile.originalname.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      const { error } = await supabase.storage.from('avatars').upload(`images/${fileName}`, avatarFile.buffer, {
        contentType: avatarFile.mimetype
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
    request.setAvatarUrl(avatarUrl);
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