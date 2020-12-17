import dynamoDB from "./libs/dynamoDB";
import { success, failure } from "./libs/response";

// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent } from "aws-lambda";

export const handler = async (event: APIGatewayEvent) => {
  const data = JSON.parse(event.body || "{}");
  const params = {
    TableName: process.env.NOTES_TABLE_NAME || "",
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'noteId': path parameter
    Key: {
      noteId: { S: event.pathParameters?.id },
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET content = :content",
    ExpressionAttributeValues: {
      ":content": {
        S: data.content,
      },
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW",
  };

  try {
    await dynamoDB.updateItem(params);
    return success({ status: true });
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
};
