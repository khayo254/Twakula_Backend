const { cloudinary } = require('./src/config/cloudinary');

cloudinary.api.ping((error, result) => {
  if (error) {
    console.error('Cloudinary connection error:', error);
  } else {
    console.log('Cloudinary connection successful:', result);
  }
});
