const cloudinary = require("cloudinary").v2;
require("dotenv").config();
module.exports = {
  upload(file_data, folder, resource_type = "image", name = null) {
    const options = {
      folder,
      resource_type
    };
    if (name) options.public_id = name;
    return cloudinary.uploader
      .upload(file_data, options)
      .then(result => result)
      .catch(error => {
        console.error(error);
        throw error;
      });
  }
};
