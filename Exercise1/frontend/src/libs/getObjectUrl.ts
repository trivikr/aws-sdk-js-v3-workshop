import { FILES_BUCKET } from "../config.json";
import { s3Client } from "./s3Client";

const getObjectUrl = async (fileName: string) =>
  s3Client.getSignedUrlPromise("getObject", {
    Key: fileName,
    Bucket: FILES_BUCKET,
  });

export { getObjectUrl };
