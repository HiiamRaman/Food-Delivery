import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  //cloudinary config
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("cloud_name:",process.env.CLOUDINARY_CLOUD_NAME);

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("File Path Not Found");
      return null;
    }

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File Uploaded Successfully!!", result.secure_url);
    return result;
  } catch (error) {
    // now we have to ctach the failed files while uploading and delete it from our server which is stored temporarily
    //  we use fs to unlink

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.log("Failed to upload", error);
    return null;
  }
};
