import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECKEY,
});

// Cloudinary storage for company logos
const companyLogoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerceapp/companylogos",
  },
});

export const uploadCompanyLogo = multer({ storage: companyLogoStorage });

// Cloudinary storage for product images
const productImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerceapp/products",
  },
});

export const uploadProductImage = multer({ storage: productImageStorage });

// Cloudinary storage for user profile images
const profileImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerceapp/profiles",
  },
});

export const uploadProfileImage = multer({ storage: profileImageStorage });

