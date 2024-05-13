const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storageCloudinary = (folderName) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName,
      allowedFormats: ["jpg", "png", "jpeg", "gif", "webp"],
    },
  });
};

const uploadProfileImage = multer({ storage: storageCloudinary("profileimg") });

const uploadPosterImage = multer({ storage: storageCloudinary("poster") });

module.exports = { uploadPosterImage, uploadProfileImage };