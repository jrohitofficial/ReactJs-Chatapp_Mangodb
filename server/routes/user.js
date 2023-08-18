const router = require('express').Router();
const authenticate = require('../middleware/auth');

const ctrl = require('../controllers/user');

router.post('/users/register', ctrl.register);
router.post('/users/login', ctrl.login);
router.post('/users/verify', authenticate, ctrl.verify);
router.get('/users', authenticate, ctrl.find);
router.delete('/users', authenticate, ctrl.delete);
router.patch('/users/change-pass', authenticate, ctrl.changePass);

module.exports = router;
