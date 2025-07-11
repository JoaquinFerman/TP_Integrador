const multer = require('multer');
const path = require('path');

const imagePath = path.join(__dirname, '..', '..', 'Public', 'images');
const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagePath),
  filename: (req, file, cb) => {
    const { name } = req.body;
    cb(null, name + '.webp');
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ext) {
    cb(null, false);
  } else if (validExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter });
module.exports = upload;