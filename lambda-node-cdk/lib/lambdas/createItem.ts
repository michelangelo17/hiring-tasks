import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB, PutItemCommand } from "@aws-sdk/client-dynamodb";

const tableName = process.env.TABLE_NAME;
const region = process.env.REGION || "eu-central-1";
const dynamoDbClient = new DynamoDB({ region });

// create newDynamoDBItem
const createDynamoDBItem = async (newItemId: string, newItemMessage: string) => {
  const command = new PutItemCommand({
    TableName: tableName,
    Item: {
      id: { S: newItemId },
      message: { S: newItemMessage },
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
  if (event.body === null) {
    return createResponse(400, { message: "Body is missing" });
  }
  const itemId = JSON.parse(event.body).id;
  const newMessage = JSON.parse(event.body).message;

  if (!itemId) {
    return createResponse(400, { message: "Item ID is missing" });
  }
  if (!newMessage) {
    return createResponse(400, { message: "New Message is missing" });
  }

  try {
    const response = await createDynamoDBItem(itemId, newMessage);
    console.log(response);

    return createResponse(200, { message: "ok - item created", data: response });
  } catch (error) {
    console.error(error);
    return createResponse(500, { message: "ERROR something went wrong!", error });
  }
};
