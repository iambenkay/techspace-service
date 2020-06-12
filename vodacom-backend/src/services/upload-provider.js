const AWS = require("aws-sdk");
const { AWS_BUCKET_NAME } = process.env;

AWS.config.update({ region: "eu-west-1" });

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
});

const uploadParams = {
  Bucket: AWS_BUCKET_NAME,
};

module.exports = {
  upload(file, key) {
    return s3
      .putObject({
        Key: `${key}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ...uploadParams,
      })
      .promise()
      .then((data) => {
        return {
          secure_url: data.Location,
          ...data,
        };
      })
      .catch((err) => {
        throw err;
      });
  },
  remove(key) {
    return s3
      .deleteObject({
        Key: key,
        ...uploadParams,
      })
      .promise()
      .then(() => {
        console.log("Object was deleted successfully");
      })
      .catch((err) => {
        throw err;
      });
  },
};
