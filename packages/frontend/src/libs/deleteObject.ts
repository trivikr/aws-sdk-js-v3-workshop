import { s3Client } from "./s3Client";
import config from "../config.json";

const { FILES_BUCKET } = config;

const deleteObject = async (fileName: string) =>
  s3Client
    .deleteObject({
      Key: fileName,
      Bucket: FILES_BUCKET,
    })
    .promise();

export { deleteObject };
