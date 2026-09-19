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

const isTest = process.env.NODE_ENV === 'test';

// Storage for company logos
const companyLogoStorage = isTest 
  ? multer.memoryStorage()
  : new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: "ecommerceapp/companylogos",
      },
    });

export const uploadCompanyLogo = multer({ storage: companyLogoStorage });

// Storage for product images
const productImageStorage = isTest
  ? multer.memoryStorage()
  : new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: "ecommerceapp/products",
      },
    });

export const uploadProductImage = multer({ storage: productImageStorage });

// Storage for user profile images
const profileImageStorage = isTest
  ? multer.memoryStorage()
  : new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: "ecommerceapp/profiles",
      },
    });

export const uploadProfileImage = multer({ storage: profileImageStorage });

