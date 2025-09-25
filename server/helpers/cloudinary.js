const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Cloudinary config (make sure dotenv is loaded at the top of server.js)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage in memory
const storage = multer.memoryStorage();

// Cloudinary upload util
async function imageUploadUtil(fileBuffer) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(fileBuffer);
  });
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };
