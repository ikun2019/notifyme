const router = require('express').Router();
const { createPost, getAllPosts, getPostsByTagId } = require('../controllers/posts.controller');

const upload = require('../middlewares/multer');

// * POST => /api/posts
router.post('/', upload.single('image'), createPost);

// * GET => /api/posts
router.get('/', getAllPosts);

// * GET => /api/posts/:tagId
router.get('/:tagId', getPostsByTagId);

module.exports = router;