const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// Local Multer storage for company logos
const companyLogoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../ecommerceapp/public/companylogo");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const uploadCompanyLogo = multer({ storage: companyLogoStorage });

// Cloudinary storage for product images
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECKEY,
});

const productImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerceapp",
  },
});

const uploadProductImage = multer({ storage: productImageStorage });

module.exports = {
  uploadCompanyLogo,
  uploadProductImage,
};
