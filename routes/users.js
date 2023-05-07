const router = require('express').Router();
const {
  getUsers, getUserId, getUserInfo, updateProfile, updateAvatar,
} = require('../controllers/users');

const {
  validationUserId,
  validationUpdateProfile,
  validationUpdateAvatar,
} = require('../middlewares/validators/userValidation');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', validationUserId, getUserId);
router.patch('/me', validationUpdateProfile, updateProfile);
router.patch('/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = router;
