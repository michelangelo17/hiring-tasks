import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB, GetItemCommand } from "@aws-sdk/client-dynamodb";

const tableName = process.env.TABLE_NAME;
const region = process.env.REGION || "eu-central-1";
const dynamoDbClient = new DynamoDB({ region });

const getDynamoDBItem = async (itemId: string) => {
  const command = new GetItemCommand({
    TableName: tableName,
    Key: { id: { S: itemId } },
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
    const response = await getDynamoDBItem(itemId);
    console.log(response);

    if (!response.Item) {
      return createResponse(404, { message: "Item not found" });
    }

    return createResponse(200, { message: "ok - item found", data: response.Item });
  } catch (error) {
    console.error(error);
    return createResponse(500, { message: "ERROR something went wrong!", error });
  }
};
