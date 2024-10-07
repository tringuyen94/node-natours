const { filterUpdate } = require('../auth/index.js');
const userModel = require('../models/users.model');
const FactoryHandler = require('../factory');
const catchAsync = require('../utils/catchAsync.js');
const removeFile = require('../utils/removeFile.js');
const updateMe = catchAsync(async (req, res, next) => {
  const filter = filterUpdate(req.body);
  if (req.file) {
    filter.photo = req.file.filename;
  }
  const updated = await userModel.findByIdAndUpdate(req.user._id, filter, {
    runValidators: true,
    new: true,
  });
  return res.status(200).json({
    status: 'success',
    data: { updated },
  });
});
const deactiveUser = async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.params.userId, { active: false });
  return res.status(204).json({
    status: 'success',
    data: null,
  });
};
const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
const updateUser = new FactoryHandler(userModel).update;
const getAllUser = new FactoryHandler(userModel).getAll;
const getUserById = new FactoryHandler(userModel).getById;
const deleteUser = new FactoryHandler(userModel).delete;

module.exports = {
  getAllUser,
  updateMe,
  deactiveUser,
  deleteUser,
  updateUser,
  getUserById,
  getMe,
};
