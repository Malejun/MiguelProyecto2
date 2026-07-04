import { v2 as cloudinary } from "cloudinary";
import env from "../misc/constants.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const uploadImageToCloudinary = async (file) => {
  if (!file) return null;

  const base64File = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  return await cloudinary.uploader.upload(base64File, {
    folder: "tb-backend/products",
  });
};
