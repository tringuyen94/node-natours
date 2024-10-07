const { unlink } = require('fs');
module.exports = async (type, fileName) => {
  let path;
  switch (type) {
    case 'user':
      if (fileName.startsWith('default')) return;
      path = './src/public/img/users/';
      unlink(path + fileName, (err) => {
        console.error(err);
      });
      break;
    case 'tour':
      path = './src/public/img/tours/';
      unlink(path + fileName, (err) => {
        console.error(err);
      });
      break;
    default:
      break;
  }
};
