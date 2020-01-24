import { s3Client } from "./s3Client";
import { config } from "../config";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const putObject = async (file: any) => {
  const Key = `${Date.now()}-${file.name}`;
  await s3Client.send(
    new PutObjectCommand({
      Key,
      Body: file,
      Bucket: config.s3Bucket,
      ACL: "public-read"
    })
  );
  return Key;
};

export { putObject };
