const { UserIdRequest } = require('../../proto/user_pb');
const userServiceClient = require('../utils/grpc/userServiceClient');

// * GET => /api/users/:userId
exports.getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const request = new UserIdRequest();
    request.setUserId(userId);
    const user = await new Promise((resolve, reject) => {
      userServiceClient.getUserInfo(request, (err, response) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
    res.status(200).json({
      id: user.getId(),
      email: user.getEmail(),
      name: user.getName(),
      avaterUrl: user.getAvaterUrl(),
      createdAt: user.getCreatedAt(),
      postCount: user.getPostCount(),
      thanksReceived: user.getThanksReceived()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};