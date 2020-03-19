const cloudinary = require("cloudinary").v2;
require("dotenv").config()
module.exports = {
  upload(file_data, folder, resource_type = "raw") {
    return cloudinary.uploader
      .upload(file_data, {
        folder,
        resource_type
      })
      .then(result => result)
      .catch(error => {
        console.error(error);
        throw error;
      });
  }
};
