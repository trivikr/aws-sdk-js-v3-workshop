import AWS from "aws-sdk";
import { IdentityPoolId } from "../config.json";

const s3Client = new AWS.S3({
  region: "us-west-2",
  credentials: new AWS.CognitoIdentityCredentials(
    {
      IdentityPoolId: IdentityPoolId,
    },
    {
      region: "us-west-2",
    }
  ),
});

export { s3Client };
