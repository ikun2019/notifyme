const { v4: uuidv4 } = require('uuid');
const { Empty } = require('google-protobuf/google/protobuf/empty_pb')
const { CreatePostRequest, TagIds } = require('../../proto/post_pb');
const { GetOrCreateTagsRequest } = require('../../proto/tag_pb');

const postServiceClient = require('../utils/grpc/postServiceClient');
const tagServiceClient = require('../utils/grpc/tagServiceClient');

const supabase = require('../utils/supabase');

// * POST => /api/posts
exports.createPost = async (req, res) => {
  console.log('🛜 CreatePpst');
  const { content, link, authorId, tags } = req.body;
  const imageFile = req.file;
  let imageUrl = null;

  try {
    // 画像アップロード
    if (imageFile) {
      const fileExt = imageFile.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;

      const { error } = await supabase.storage.from('posts').upload(`images/${fileName}`, imageFile.buffer, {
        contentType: imageFile.mimetype
      });

      if (error) {
        console.error('❌ Supabase upload error:', error.message);
        return res.status(500).json({ error: '画像のアップロードに失敗しました' });
      }

      imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/posts/images/${fileName}`;
    }

    // タグの取得と作成
    const tagRequest = new GetOrCreateTagsRequest();
    const namesArray = tags.split(',').map(name => name.trim()).filter(name => name !== '');
    tagRequest.setNamesList(namesArray);
    const tagResponse = await new Promise((resolve, reject) => {
      tagServiceClient.getOrCreateTags(tagRequest, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });

    const tagIds = tagResponse.getTagsList().map(tag => tag.getId());

    const request = new CreatePostRequest();
    request.setAuthorId(authorId);
    request.setContent(content);
    request.setLink(link);
    request.setImageUrl(imageUrl);

    const tagIdsMessage = new TagIds();
    tagIdsMessage.setIdsList(tagIds);
    request.setTagIds(tagIdsMessage);

    const post = await new Promise((resolve, reject) => {
      postServiceClient.createPost(request, (err, response) => {
        if (err) {
          console.error('gRPC error:', err);
          reject(err);
        }
        resolve(response);
      });
    });
    res.status(200).json({
      id: post.getId(),
      authorId: post.getAuthorId(),
      content: post.getContent(),
      link: post.getLink(),
      imageUrl: post.getImageUrl(),
      createdAt: post.getCreatedAt()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// * GET => /api/posts
exports.getAllPosts = async (req, res) => {
  try {
    const request = new Empty();
    console.log('getAllPosts');

    const postsResponse = await new Promise((resolve, reject) => {
      postServiceClient.listPosts(request, (err, response) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });

    const posts = postsResponse.getPostsList().map((post) => ({
      id: post.getId(),
      authorId: post.getAuthorId(),
      content: post.getContent(),
      link: post.getLink(),
      imageUrl: post.getImageUrl(),
      tags: post.getTagsList().map((tag) => ({
        id: tag.getId(),
        name: tag.getName()
      })),
      createdAt: post.getCreatedAt()
    }));
    return res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getTagIds = (tagNames) => {
  return new Promise((resolve, reject) => {
    const request = new GetOrCreateTagsRequest();
    request.setNamesList(tagNames);

    tagServiceClient.getOrCreateTags(request, (err, response) => {
      if (err) return reject(err);
      const tagIds = response.getTagsList().map((tag) => tag.getId());
      resolve(tagIds);
    });
  });
};