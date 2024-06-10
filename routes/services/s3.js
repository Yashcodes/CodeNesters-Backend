const dotenv = require("dotenv");
const {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

dotenv.config();

//! Creating a client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

//! Getting object url
module.exports.getObjectURL = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  });

  //* Generating signed url
  const url = await getSignedUrl(s3Client, command);
  return url;
};

//! Putting object in S3
module.exports.putObjectURL = async (key, contentType) => {
  const command = new PutObjectCommand({
    Bucket: "codenesters-users",
    Key: key,
    ContentType: contentType,
  });

  //* Generating signed url
  const url = await getSignedUrl(s3Client, command);
  return url;
};
