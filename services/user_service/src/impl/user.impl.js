const grpc = require('@grpc/grpc-js');

const supabase = require('../utils/supabaseClient');

const { UserInfoResponse } = require('../../proto/user_pb');

exports.getUserInfo = async (call, callback) => {
  const { userId } = call.request.toObject();
  try {
    const { data, error } = await supabase.auth.admin.getUserById(userId);
    if (error || !data?.user) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'User not found.'
      });
    }
    const user = data.user;
    const response = new UserInfoResponse();
    response.setId(user.id);
    response.setEmail(user.email);
    response.setName(user.user_metadata.displayName);
    response.setAvaterUrl(user.avater_url);
    response.setCreatedAt(user.created_at);
    response.setPostCount(user.post_count);
    response.setThanksReceived(user.thanks_received);
    callback(null, response);
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message
    })
  }
};