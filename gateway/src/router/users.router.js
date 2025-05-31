const router = require('express').Router();
const { getUser } = require('../controllers/users.controller');

router.get('/:userId', getUser);

module.exports = router;