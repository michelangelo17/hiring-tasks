import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const tableName = process.env.TABLE_NAME;
const region = process.env.REGION || "eu-central-1";
const dynamoDbClient = new DynamoDB({ region });

const updateDynamoDBItem = async (itemId: string, newMessage: string) => {
  const command = new UpdateItemCommand({
    TableName: tableName,
    Key: { id: { S: itemId } },
    UpdateExpression: "SET #message = :message",
    ExpressionAttributeNames: {
      "#message": "message",
    },
    ExpressionAttributeValues: {
      ":message": { S: newMessage },
    },
  });
  return await dynamoDbClient.send(command);
};

const createResponse = (statusCode: number, body: Object): APIGatewayProxyResult => ({
  statusCode,
  body: JSON.stringify(body),
});

// Handler
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const itemId = event.pathParameters?.id;
  const newMessage = event.body;
  if (!itemId) {
    return createResponse(400, { message: "Item ID is missing" });
  }
  if (!newMessage) {
    return createResponse(400, { message: "New Message is missing" });
  }

  try {
    const response = await updateDynamoDBItem(itemId, newMessage);
    console.log(response);

    if (!response) {
      return createResponse(404, { message: "Item not found" });
    }

    return createResponse(200, { message: "ok - item found", data: response });
  } catch (error) {
    console.error(error);
    return createResponse(500, { message: "ERROR something went wrong!", error });
  }
};
