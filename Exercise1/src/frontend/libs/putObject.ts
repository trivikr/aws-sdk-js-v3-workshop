import { s3Client } from "./s3Client";
import { s3Bucket } from "../config.json";

const putObject = async (file: File) => {
  const Key = `${Date.now()}-${file.name}`;
  await s3Client
    .putObject({
      Key,
      Body: file,
      Bucket: s3Bucket,
      ACL: "public-read",
    })
    .promise();
  return Key;
};

export { putObject };
