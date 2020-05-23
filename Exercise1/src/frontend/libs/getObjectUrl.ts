import { s3Client } from "./s3Client";
import { s3Bucket } from "../config.json";

const getObjectUrl = async (fileName: string) =>
  s3Client.getSignedUrlPromise("getObject", {
    Key: fileName,
    Bucket: s3Bucket,
  });

export { getObjectUrl };
