import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DeleteItemCommand, DynamoDB } from "@aws-sdk/client-dynamodb";

const tableName = process.env.TABLE_NAME;
const region = process.env.REGION || "eu-central-1";
const dynamoDbClient = new DynamoDB({ region });

const deleteDynamoDBItem = async (itemId: string) => {
  // deleteDynamoDBItem
  const command = new DeleteItemCommand({
    TableName: tableName,
    Key: {
      id: { S: itemId },
    },
    ReturnValues: "ALL_OLD",
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
  if (!itemId) {
    return createResponse(400, { message: "Item ID is missing" });
  }

  try {
    const response = await deleteDynamoDBItem(itemId);
    console.log(response);

    return createResponse(200, { message: "ok - item deleted", data: response });
  } catch (error) {
    console.error(error);
    return createResponse(500, { message: "ERROR something went wrong!", error });
  }
};
