const router = require('express').Router();
const { createPost, getAllPosts, getPostsByTagId, getTotalViewsByAuthor } = require('../controllers/posts.controller');

const upload = require('../middlewares/multer');

// * POST => /api/posts
router.post('/', upload.single('image'), createPost);

// * GET => /api/posts
router.get('/', getAllPosts);

// * GET => /api/posts/:tagId
router.get('/:tagId', getPostsByTagId);

// * GET => /api/posts/total-views/:userId
router.get('/total-views/:userId', getTotalViewsByAuthor);

module.exports = router;