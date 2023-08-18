const router = require('express').Router();
const authenticate = require('../middleware/auth');
const ctrl = require('../controllers/inbox');

router.get('/inboxes', authenticate, ctrl.find);

module.exports = router;
