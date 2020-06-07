const AWS = require("aws-sdk");
const { AWS_BUCKET_NAME } = process.env;

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
});

module.exports = {
  upload(file, key) {
    return s3
      .putObject({
        Bucket: AWS_BUCKET_NAME,
        Key: `${key}`,
        Body: file.buffer,
        ContentType: file.mimetype,
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
        Bucket: AWS_BUCKET_NAME,
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
