import { S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { IDENTITY_POOL_ID } from "../config.json";

const s3Client = new S3Client({
  region: "us-west-2",
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({
      region: "us-west-2",
    }),
    identityPoolId: IDENTITY_POOL_ID,
  }),
});

export { s3Client };
