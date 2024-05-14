import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB, GetItemCommand } from "@aws-sdk/client-dynamodb";

const tableName = process.env.TABLE_NAME;
// Create a new DynamoDB client, passing the region as an argument
const dynamoDbClient = new DynamoDB({ region: process.env.REGION || "eu-central-1" });

type DBItem = { item_id: string };
// Handler, gets an item from the DynamoDB table that matches the primary key via path parameter
// dynamodb table is not seeded, no function to create items exists
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const itemId = event.pathParameters?.id;
    // Check if the item_id is provided in the event object.
    console.log(event);
    if (!itemId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "item_id is required" }),
      };
    }
    const command = new GetItemCommand({
      TableName: tableName,
      Key: {
        id: { S: itemId },
      },
    });
    const response = await dynamoDbClient.send(command);
    console.log(response);

    // If the item is not found in the DynamoDB table, return a 404 status code and a message.
    if (!response.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Item not found" }),
      };
    }
    // Return the item found in the DynamoDB table with a 200 status code and a message.
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "ok - item found",
        data: response.Item,
      }),
    };
  } catch (error) {
    // Return a 500 status code and an error message if something goes wrong.
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "ERROR something went wrong!",
        error: error,
      }),
    };
  }
};
