const grpc = require('@grpc/grpc-js');

const prisma = require('../utils/prismaClient');
const { ThanksCountResponse } = require('../../proto/thank_pb');

exports.getThanksCountForUser = async (call, callback) => {
  const { user_id } = call.request.toObject();
  try {
    const count = await prisma.thank.count({
      where: { toUserId: user_id }
    });
    const response = new ThanksCountResponse();
    response.setCount(count);
    callback(null, response);
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message
    });
  }
};