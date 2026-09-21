import { env } from "./env.js";
import { v2 as cloudinary } from "cloudinary";

const cloudName = env.cloudinary.cloudName;
const apiKey = env.cloudinary.apiKey;
const apiSecret = env.cloudinary.apiSecret;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error("Missing Cloudinary environment variables");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export default cloudinary;