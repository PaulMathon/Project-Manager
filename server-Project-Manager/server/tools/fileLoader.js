const multer = require('multer');
const path = require('path');

const createStorage = (storagePath) => multer.diskStorage({
  destination: (req, file, callback) => {
    // callback(null, );
    callback(null, storagePath);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const createFileFilter = (extensions) => (req, file, callback) => {
  const ext = path.extname(file.originalname);
  // if right file type
  if (extensions.includes(ext)) {
    callback(null, true);
  } else {
    console.log('Wrong file type');
    callback(new Error(`Only files with extension ${extensions.toString()} are allowed`), false);
  }
};

const createLoader = (storagePath, extensions, fileSize = 1024 * 1024 * 5) => {
  const storage = createStorage(storagePath);
  const fileFilter = createFileFilter(extensions);

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize
    }
  });
};

module.exports = createLoader;
