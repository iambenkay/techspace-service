const AWS = require("aws-sdk");
const c = require("../data/collections");
const shortid = require("../services/shortid-provider");

const { AWS_BUCKET_NAME } = process.env;

AWS.config.update({ region: "eu-west-1" });

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
});

const uploadParams = {
  Bucket: AWS_BUCKET_NAME,
};

module.exports = {
  async upload(file, key) {
    return s3
      .upload({
        Key: `${key}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ...uploadParams,
      })
      .promise()
      .then(async ({ Key }) => {
        const media = await c.media.insert({
          code: shortid.generate(),
          key: Key,
        });
        return {
          secure_url: `${process.env.CLIENT_APP}/m/${media.code}`,
        };
      })
      .catch((err) => {
        throw err;
      });
  },
  fetch(key) {
    return s3
      .getObject({
        ...uploadParams,
        Key: `${key}`,
      })
      .promise()
      .then(({ Body }) => ({ data: Body }))
      .catch((err) => {
        throw err;
      });
  },
  remove(key) {
    return s3
      .deleteObject({
        Key: `${key}`,
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
