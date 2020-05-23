import { s3Client } from "./s3Client";
import { s3Bucket } from "../config.json";

const deleteObject = async (fileName: string) =>
  s3Client
    .deleteObject({
      Key: fileName,
      Bucket: s3Bucket,
    })
    .promise();

export { deleteObject };
