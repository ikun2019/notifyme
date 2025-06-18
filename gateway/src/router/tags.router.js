const router = require('express').Router();
const { getAllTags } = require('../controllers/tags.controller');

// * GET => /api/tags
router.get('/', getAllTags);

module.exports = router;