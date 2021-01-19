import AWS from "aws-sdk";
import config from "../config.json";

const { IDENTITY_POOL_ID } = config;

const s3Client = new AWS.S3({
  region: "us-west-2",
  credentials: new AWS.CognitoIdentityCredentials(
    {
      IdentityPoolId: IDENTITY_POOL_ID,
    },
    {
      region: "us-west-2",
    }
  ),
});

export { s3Client };
