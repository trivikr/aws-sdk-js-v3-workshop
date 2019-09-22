import { S3Client } from "@aws-sdk/client-s3-node/S3Client";

const s3Client = new S3Client({
  region: "us-west-2"
});

export { s3Client };
