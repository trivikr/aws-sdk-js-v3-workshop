// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent } from "aws-lambda";
import { dynamoDB } from "./libs/dynamoDB";
import { failure, success } from "./libs/response";


export const handler = async (event: APIGatewayEvent) => {
  const params = {
    TableName: process.env.NOTES_TABLE_NAME || "",
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'noteId': path parameter
    Key: {
      noteId: { S: event?.pathParameters?.id },
    },
  };

  try {
    const result = await dynamoDB.getItem(params).promise();
    if (result.Item) {
      // Return the retrieved item
      return success(result.Item);
    } else {
      return failure({ status: false, error: "Item not found." });
    }
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
};
