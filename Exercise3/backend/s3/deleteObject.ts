import { DeleteObjectCommand } from "@aws-sdk/client-s3-browser/commands/DeleteObjectCommand";
import { s3Client } from "./s3Client";
import { success, failure } from "../response";

export async function main(event) {
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Key: event.pathParameters.fileName,
        Bucket: process.env.bucketName || ""
      })
    );
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
