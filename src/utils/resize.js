const sharp = require('sharp');
const removeFile = require('./removeFile');
const processResize = async (fileBuffer, size, path) => {
  await sharp(fileBuffer)
    .resize(size.width, size.height)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path);
};
module.exports = (type) => {
  return async (req, res, next) => {
    if (!req.file && !req.files) return next();
    switch (type) {
      case 'user':
        req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
        removeFile(req.user.photo);
        await processResize(
          req.file.buffer,
          { width: 300, height: 300 },
          `./src/public/img/users/${req.file.filename}`
        );
        break;
      case 'tour':
        if (req.files.imageCover) {
          req.body.imageCover = `tour-${req.params.id}-cover.jpeg`;
          removeFile(req.body.imageCover);
          await processResize(
            req.files.imageCover[0].buffer,
            {
              width: 2000,
              height: 1300,
            },
            `./src/public/img/tours/${req.body.imageCover}`
          );
        }
        if (req.files.images) {
          req.body.images = [];
          await Promise.all(
            req.files.images.map(async (image, index) => {
              image.filename = `tour-${req.params.id}-${index + 1}.jpeg`;
              removeFile(image.filename);
              await processResize(
                image.buffer,
                {
                  width: 2000,
                  height: 1300,
                },
                `./src/public/img/tours/${image.filename}`
              );
              req.body.images.push(image.filename);
            })
          );
          break;
        }

      default:
        break;
    }
    next();
  };
};
