const router = require('express').Router();
const authenticate = require('../middleware/auth');
const ctrl = require('../controllers/chat');

router.get('/chats/:roomId', authenticate, ctrl.findByRoomId);
router.delete('/chats/:roomId', authenticate, ctrl.deleteByRoomId);

module.exports = router;
