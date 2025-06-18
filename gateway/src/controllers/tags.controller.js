const { Empty } = require('google-protobuf/google/protobuf/empty_pb');
const { GetAllTagsRequest } = require('../../proto/tag_pb');
const tagServiceClient = require('../utils/grpc/tagServiceClient');

// * GET => /api/tags
exports.getAllTags = async (req, res) => {
  console.log('getAllTags');
  const { search } = req.query;
  try {
    const request = new GetAllTagsRequest();
    request.setSearch(search);

    const tagResponse = await new Promise((resolve, reject) => {
      tagServiceClient.getAllTags(request, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
    const tags = tagResponse.getTagsList().map((tag) => ({
      id: tag.getId(),
      name: tag.getName()
    }));
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};