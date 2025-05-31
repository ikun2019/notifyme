const grpc = require('@grpc/grpc-js');
const prisma = require('../utils/prismaClient');

const { PostCountResponse, PostResponse, ListPostsResponse } = require('../../proto/post_pb');

exports.getPostCountByAuthor = async (call, callback) => {
  const { author_id } = call.request.toObject();
  try {
    const count = await prisma.post.count({
      where: { authorId: author_id }
    });
    const response = new PostCountResponse();
    response.setCount(count);
    callback(null, response);
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message
    });
  }
};

// * Post投稿
exports.createPost = async (call, callback) => {
  const { authorId, content, imageUrl, link, tagIds } = call.request.toObject();

  try {
    const post = await prisma.post.create({
      data: {
        authorId: authorId,
        content: content,
        imageUrl: imageUrl,
        link: link,
        tags: tagIds.idsList.length > 0 ? {
          create: tagIds.idsList.map(tagId => ({
            tag: {
              connect: { id: tagId }
            }
          }))
        } : undefined
      },
      include: {
        tags: true
      }
    });
    const response = new PostResponse();
    response.setId(post.id);
    response.setAuthorId(post.authorId);
    response.setContent(post.content);
    response.setLink(post.link);
    response.setImageUrl(post.imageUrl);
    response.setCreatedAt(post.createdAt);
    callback(null, response);
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message
    });
  }
};

// * Posts取得
exports.listPosts = async (call, callback) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const response = new ListPostsResponse();
    posts.forEach((post) => {
      const item = new PostResponse();
      item.setId(post.id);
      item.setAuthorId(post.authorId);
      item.setContent(post.content);
      item.setLink(post.link);
      item.setImageUrl(post.imageUrl);
      item.setCreatedAt(post.createdAt.toISOString());
      response.addPosts(item);
    });
    callback(null, response);
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message
    });
  }
};