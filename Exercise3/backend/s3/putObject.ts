import { s3Client } from "./s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3-browser/commands/PutObjectCommand";
import { success, failure } from "../response";

export async function main(event) {
  try {
    const { file } = event.pathParameters;
    const Key = `${Date.now()}-${file.name}`;
    await s3Client.send(
      new PutObjectCommand({
        Key,
        Body: file,
        Bucket: process.env.bucketName || "",
        ACL: "public-read"
      })
    );
    return success(Key);
  } catch (e) {
    return failure({ status: false });
  }
}
