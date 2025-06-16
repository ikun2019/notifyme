const grpc = require('@grpc/grpc-js');
const { GetOrCreateTagsResponse, Tag } = require('../../proto/tag_pb');
const prisma = require('../utils/prismaClient');

exports.getOrCreateTags = async (call, callback) => {
  const { namesList } = call.request.toObject();

  try {
    const tags = await Promise.all(
      namesList.map(async (name) => {
        const existTags = await prisma.tag.findUnique({ where: { name } });
        if (existTags) return existTags;
        return await prisma.tag.create({ data: { name } });
      })
    );

    const response = new GetOrCreateTagsResponse();
    tags.forEach(tag => {
      const tagMessage = new Tag();
      tagMessage.setId(tag.id);
      tagMessage.setName(tag.name);
      response.addTags(tagMessage);
    })

    callback(null, response);
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message
    });
  }
};

