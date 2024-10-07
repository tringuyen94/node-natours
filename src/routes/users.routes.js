const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');
const { authentication, authorization } = require('../auth');
const upload = require('../utils/uploadFile');
const resize = require('../utils/resize');

router.use(authentication);
router
  .route('/')
  .get(authorization('admin', 'lead-guide'), userController.getAllUser);
router
  .route('/me')
  .get(userController.getMe, userController.getUserById)
  .patch(upload.single('photo'), resize('user'), userController.updateMe);
router
  .route('/:id')
  .get(userController.getUserById)
  .patch(authorization('admin'), userController.updateUser)
  .patch(authorization('admin', 'lead-guide'), userController.deactiveUser)
  .delete(authorization('admin'), userController.deleteUser);
module.exports = router;
