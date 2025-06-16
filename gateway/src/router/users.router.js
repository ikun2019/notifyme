const router = require('express').Router();
const upload = require('../middlewares/multer');
const { getUser, createUser, updateUser, followTag, unFollowTag, getFollowTag } = require('../controllers/users.controller');

// * POST => /api/users
router.post('/', createUser);
// * GET => /api/users/:userId
router.get('/:userId', getUser);
// * PUT => /api/users/:userId
router.put('/:userId', upload.single('avatar'), updateUser);

// * POST => /api/users/follow-tag
router.post('/follow-tag', followTag);
// * DELETE => /api/users/follow-tag
router.delete('/follow-tag', unFollowTag);
// * GET => /api/users/follow-tag/:userId
router.get('/follow-tag/:userId', getFollowTag);

module.exports = router;