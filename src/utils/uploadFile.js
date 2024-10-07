const multer = require('multer');
// const storage = multer.diskStorage({
//   destination: './src/public/img/users', // folder where the files will be stored
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split('/')[1];
//     // Append the date to the file name to avoid name conflicts
//     cb(null, req.user._id + '-' + Date.now() + '.' + ext);
//   },
// });

const storage = multer.memoryStorage();
const checkFileType = (file, cb) => {
  if (file.mimetype.split('/')[0] === 'image') {
    return cb(null, true);
  } else {
    cb('Error: Images Only!', false);
  }
};

module.exports = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});
