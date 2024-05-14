import { APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB, GetItemCommand } from "@aws-sdk/client-dynamodb";

const tableName = process.env.TABLE_NAME;
// region hardcoded, should be passed as an environment variable
const dynamoDbClient = new DynamoDB({ region: "eu-central-1" });

type DBItem = { item_id: string };
// Handler, gets an item from the DynamoDB table that matches the primary key sent API Gateway event item
// missing error handling, dynamodb table is not seeded, no function to create items exists
export const handler = async (event: DBItem): Promise<APIGatewayProxyResult> => {
  const command = new GetItemCommand({
    TableName: tableName,
    Key: {
      id: { S: event.item_id },
    },
  });
  const response = await dynamoDbClient.send(command);
  // Return the item found in the DynamoDB table with a 200 status code and a message.
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "ok - item found",
      data: response.Item,
    }),
  };
};
