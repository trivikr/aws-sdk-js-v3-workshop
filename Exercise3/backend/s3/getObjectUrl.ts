import { createRequest } from "@aws-sdk/util-create-request";
import { GetObjectCommand } from "@aws-sdk/client-s3-browser/commands/GetObjectCommand";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { formatUrl } from "@aws-sdk/util-format-url";
import { s3Client } from "./s3Client";
import { success, failure } from "../response";

export async function main(event) {
  try {
    const request = await createRequest(
      s3Client,
      new GetObjectCommand({
        Key: event.pathParameters.fileName,
        Bucket: process.env.bucketName || ""
      })
    );

    const signer = new S3RequestPresigner({
      ...s3Client.config
    });

    const url = await signer.presignRequest(
      request,
      new Date(Date.now() + 60 * 60 * 1000)
    );

    // @ts-ignore
    return success(formatUrl(url));
  } catch (e) {
    return failure({ status: false });
  }
}
