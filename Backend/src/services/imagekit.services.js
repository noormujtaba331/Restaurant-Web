const imagekit = require("../utils/imagekit");


const uploadToImageKit = async (fileBuffer, fileName) => {
  try {
    const uploadResponse = await imagekit.upload({
      file: fileBuffer.toString("base64"), // Base64 encoded file
      fileName: fileName, // Direct original name use hoga (e.g. "my-image.jpg")
      folder: "/products",
    });

    return uploadResponse.url; // ImageKit URL return karega
  } catch (error) {
    throw new Error(`ImageKit Upload Failed: ${error.message}`);
  }
};

module.exports =  uploadToImageKit ;