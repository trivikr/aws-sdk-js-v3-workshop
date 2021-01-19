import { s3Client } from "./s3Client";
import config from "../config.json";

const { FILES_BUCKET } = config;

const putObject = async (file: File) => {
  const Key = `${Date.now()}-${file.name}`;
  await s3Client
    .putObject({
      Key,
      Body: file,
      Bucket: FILES_BUCKET,
    })
    .promise();
  return Key;
};

export { putObject };
