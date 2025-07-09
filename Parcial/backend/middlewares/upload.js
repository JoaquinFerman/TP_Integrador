const multer = require('multer');
const path = require('path');

const imagePath = path.join(__dirname, '..', 'Public', 'images');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagePath),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
}
});

const upload = multer({ storage });
module.exports = upload;
