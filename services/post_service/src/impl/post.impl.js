const grpc = require('@grpc/grpc-js');
const prisma = require('../utils/prismaClient');
const redis = require('../utils/redis/redisClient');

const { PostResponse, ListPostsResponse, Tag, AuthStatsResponse } = require('../../proto/post_pb');
const { sendPostCreatedEvent } = require('../utils/kafka/kafkaProducer');

// * AuthStatsのカウント
exports.getAuthStats = async (call, callback) => {
  const { authorId } = call.request.toObject();
  const cacheKey = `stats:${authorId}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      const response = new AuthStatsResponse();
      response.setPostsCount(parsed.postsCount);
      response.setTotalViews(parsed.totalViews);
      response.setThanksCount(parsed.thanksCount || 0);
      return callback(null, response);
    }
    const [count, views] = await Promise.all([
      prisma.post.count({
        where: { authorId: authorId }
      }),
      prisma.post.aggregate({
        _sum: { views: true },
        where: { authorId: authorId }
      }),
    ]);

    const totalViews = views._sum.views || 0;
    const thanksCount = 0;

    const response = new AuthStatsResponse();
    response.setPostsCount(count);
    response.setTotalViews(totalViews);
    response.setThanksCount(thanksCount);

    await redis.set(
      cacheKey,
      JSON.stringify({
        postsCount: count,
        totalViews: totalViews,
        thanksCount: thanksCount
      }),
      'EX',
      1800
    );
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
        tags: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });
    // profileのpostsを更新
    await prisma.profile.update({
      where: { userId: authorId },
      data: {
        post_count: { increment: 1 }
      }
    });
    await redis.del(`user:info:${authorId}`);
    await redis.del(`stats:${authorId}`);
    // Kafkaへpush
    await sendPostCreatedEvent('post-created', post);
    // Redisキャッシュ
    if (post.tags && post.tags.length > 0) {
      for (const tagRelation of post.tags) {
        const tagId = tagRelation.tag.id;
        await redis.del(`tag:${tagId}:posts`);
      }
    };
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

// * Posts一覧取得
exports.listPosts = async (call, callback) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
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
      post.tags.forEach((tag) => {
        const tagItem = new Tag();
        tagItem.setId(tag.tag.id);
        tagItem.setName(tag.tag.name);
        item.addTags(tagItem);
      })
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

// * PostsにTagフィルターをかけて取得
exports.getPostsByTagId = async (call, callback) => {
  const { tagId } = call.request.toObject();
  const cacheKey = `tag:${tagId}:posts`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      const response = ListPostsResponse.deserializeBinary(Uint8Array.from(parsed));
      return callback(null, response);
    }

    const posts = await prisma.post.findMany({
      where: {
        tags: {
          some: {
            tagId: tagId
          }
        }
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const response = new ListPostsResponse();
    posts.forEach((post) => {
      const item = new PostResponse();
      item.setId(post.id);
      item.setAuthorId(post.authorId);
      item.setContent(post.content);
      item.setLink(post.link);
      item.setImageUrl(post.imageUrl);
      item.setCreatedAt(post.createdAt);
      post.tags.forEach((tagRelation) => {
        const tagItem = new Tag();
        console.log(tagRelation)
        tagItem.setId(tagRelation.tag.id);
        tagItem.setName(tagRelation.tag.name);
        item.addTags(tagItem);
      });
      response.addPosts(item);
    });
    await redis.set(cacheKey, JSON.stringify([...response.serializeBinary()]), 'EX', 1800);
    callback(null, response);
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message
    });
  }
};