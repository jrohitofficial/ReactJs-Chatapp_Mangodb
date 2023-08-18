const router = require('express').Router();
const authenticate = require('../middleware/auth');
const ctrl = require('../controllers/group');

router.get('/groups/:groupId', authenticate, ctrl.findById);
router.get(
  '/groups/:groupId/participants/name',
  authenticate,
  ctrl.participantsName
);
router.get('/groups/:groupId/participants', authenticate, ctrl.participants);

module.exports = router;
