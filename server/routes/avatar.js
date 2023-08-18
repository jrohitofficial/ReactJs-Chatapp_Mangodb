const router = require('express').Router();
const authenticate = require('../middleware/auth');
const ctrl = require('../controllers/avatar');

router.post('/avatars', authenticate, ctrl.upload);

module.exports = router;
