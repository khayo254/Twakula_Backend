const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Define the storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Define file filter to allow only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Incorrect file type');
    error.status = 400;
    return cb(error, false);
  }
  cb(null, true);
};

// Define multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5 MB file size limit
  }
});

// Define function to optimize images using sharp
const optimizeImage = async (filePath) => {
  const optimizedImagePath = `uploads/optimized-${Date.now()}.jpeg`;

  await sharp(filePath)
    .resize({ width: 800, height: 600, fit: 'cover' }) // Resize and crop the image
    .jpeg({ quality: 80 }) // Optimize the image
    .toFile(optimizedImagePath);

  return optimizedImagePath; // Return the path of the optimized image
};

module.exports = { upload, optimizeImage };
