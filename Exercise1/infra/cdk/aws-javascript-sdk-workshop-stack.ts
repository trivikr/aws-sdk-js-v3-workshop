import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as apigw from "@aws-cdk/aws-apigateway";
import * as s3 from "@aws-cdk/aws-s3";
import * as cognito from "@aws-cdk/aws-cognito";
import * as iam from "@aws-cdk/aws-iam";
import { NotesApi } from "./notes-api";

export class AwsJavaScriptSdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, "Notes", {
      partitionKey: { name: "noteId", type: dynamodb.AttributeType.STRING },
    });

    const api = new apigw.RestApi(this, "AwsJavaScriptSdkWorkshopEndpoint");
    const notes = api.root.addResource("notes");
    notes.addMethod(
      "GET",
      new apigw.LambdaIntegration(
        new NotesApi(this, "listNotes", {
          table,
          grantActions: ["dynamodb:Scan"],
        }).handler
      )
    );
    notes.addMethod(
      "POST",
      new apigw.LambdaIntegration(
        new NotesApi(this, "createNote", {
          table,
          grantActions: ["dynamodb:PutItem"],
        }).handler
      )
    );

    const note = notes.addResource("{id}", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
      },
    });
    note.addMethod(
      "GET",
      new apigw.LambdaIntegration(
        new NotesApi(this, "getNote", {
          table,
          grantActions: ["dynamodb:GetItem"],
        }).handler
      )
    );
    note.addMethod(
      "PUT",
      new apigw.LambdaIntegration(
        new NotesApi(this, "updateNote", {
          table,
          grantActions: ["dynamodb:UpdateItem"],
        }).handler
      )
    );
    note.addMethod(
      "DELETE",
      new apigw.LambdaIntegration(
        new NotesApi(this, "deleteNote", {
          table,
          grantActions: ["dynamodb:DeleteItem"],
        }).handler
      )
    );

    const filesBucket = new s3.Bucket(this, "FilesBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });
    filesBucket.addCorsRule({
      allowedOrigins: apigw.Cors.ALL_ORIGINS,
      allowedMethods: [
        s3.HttpMethods.PUT,
        s3.HttpMethods.GET,
        s3.HttpMethods.DELETE,
      ],
      allowedHeaders: apigw.Cors.DEFAULT_HEADERS,
    });

    const identityPool = new cognito.CfnIdentityPool(this, "IdentityPool", {
      allowUnauthenticatedIdentities: true,
    });

    const unauthenticated = new iam.Role(
      this,
      "IdentityPoolUnauthenticatedRole",
      {
        assumedBy: new iam.FederatedPrincipal(
          "cognito-identity.amazonaws.com",
          {
            StringEquals: {
              "cognito-identity.amazonaws.com:aud": identityPool.ref,
            },
            "ForAnyValue:StringLike": {
              "cognito-identity.amazonaws.com:amr": "unauthenticated",
            },
          },
          "sts:AssumeRoleWithWebIdentity"
        ),
      }
    );

    filesBucket.grantReadWrite(unauthenticated, [
      "s3:PutObject",
      "s3:GetObject",
      "s3:DeleteObject",
    ]);

    new cognito.CfnIdentityPoolRoleAttachment(
      this,
      "IdentityPoolRoleAttachment",
      {
        identityPoolId: identityPool.ref,
        roles: {
          unauthenticated: unauthenticated.roleArn,
        },
      }
    );

    new cdk.CfnOutput(this, "GATEWAY_URL", { value: api.url });
    new cdk.CfnOutput(this, "IDENTITY_POOL_ID", { value: identityPool.ref });
    new cdk.CfnOutput(this, "S3_BUCKET", { value: filesBucket.bucketName });
  }
}
