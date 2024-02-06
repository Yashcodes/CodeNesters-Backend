const dotenv = require("dotenv");
const {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

dotenv.config();

//! Step-1: Creating a client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

//! Step-2
module.exports.getObjectURL = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  });

  //* Generating signed url
  const url = await getSignedUrl(s3Client, command);
  return url;
};

//! Step-3: Accessing the signed url for getting/viweing object
// console.log(
//   "URL is: ",
//   await getObjectURL("uploads/userProfiles/image-1705854434034.png")
// );

//! Step-4: Putting object in S3
module.exports.putObjectURL = async (fileName, contentType) => {
  const command = new PutObjectCommand({
    Bucket: "codenesters",
    Key: `uploads/userProfiles/${fileName}`,
    ContentType: contentType,
  });

  //* Generating signed url
  const url = await getSignedUrl(s3Client, command);
  return url;
};

//! Getting the url by calling the function
// console.log(
//   "URL for uploading file: ",
//   await putObject(`image-${Date.now()}.png`, "image/png")
// );
