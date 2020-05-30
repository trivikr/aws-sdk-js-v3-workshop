import dynamoDBClient from "./libs/dynamoDB";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { success, failure } from "./libs/response";

export const handler = async () => {
  const params = {
    TableName: process.env.NOTES_TABLE_NAME || "",
  };

  try {
    const result = await dynamoDBClient.send(new ScanCommand(params));
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
};
