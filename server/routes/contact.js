const router = require('express').Router();
const authenticate = require('../middleware/auth');
const ctrl = require('../controllers/contact');

router.post('/contacts', authenticate, ctrl.insert);
router.get('/contacts', authenticate, ctrl.find);
router.delete('/contacts/:friendId', authenticate, ctrl.deleteByFriendId);

module.exports = router;
