const router = require('express').Router();
const upload = require('../middlewares/multer');
const { getUser, createUser, updateUser } = require('../controllers/users.controller');

// * POST => /api/users
router.post('/', createUser);
// * GET => /api/users/:userId
router.get('/:userId', getUser);
// * PUT => /api/users/:userId
router.put('/:userId', upload.single('avatar'), updateUser);

module.exports = router;