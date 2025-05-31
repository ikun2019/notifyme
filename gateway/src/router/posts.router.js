const router = require('express').Router();
const { createPost, getAllPosts } = require('../controllers/posts.controller');

const upload = require('../middlewares/multer');

// * POST => /api/posts
router.post('/', upload.single('image'), createPost);

// * GET => /api/posts
router.get('/', getAllPosts);

module.exports = router;