import { s3Client } from "./s3Client";
import config from "../config.json";

const { FILES_BUCKET } = config;

const getObjectUrl = async (fileName: string) =>
  s3Client.getSignedUrlPromise("getObject", {
    Key: fileName,
    Bucket: FILES_BUCKET,
  });

export { getObjectUrl };
