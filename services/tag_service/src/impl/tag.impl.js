const grpc = require('@grpc/grpc-js');
const { GetOrCreateTagsResponse, GetAllTagsResponse, Tag } = require('../../proto/tag_pb');
const prisma = require('../utils/prismaClient');

exports.getOrCreateTags = async (call, callback) => {
  const { namesList } = call.request.toObject();

  try {
    const tags = await Promise.all(
      namesList.map(async (name) => {
        const existTags = await prisma.tag.findFirst({ where: { name } });
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

exports.getAllTags = async (call, callback) => {
  const { search } = call.request.toObject();
  try {
    const tags = await prisma.tag.findMany({
      where: search ? {
        name: {
          contains: search,
          mode: 'insensitive'
        },
      } : {}
    });
    const response = new GetAllTagsResponse();
    tags.forEach((tag) => {
      const tagItem = new Tag();
      tagItem.setId(tag.id);
      tagItem.setName(tag.name);
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