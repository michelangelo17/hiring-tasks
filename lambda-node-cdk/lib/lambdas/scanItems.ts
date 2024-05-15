import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB, ScanCommand } from "@aws-sdk/client-dynamodb";

const tableName = process.env.TABLE_NAME;
const region = process.env.REGION || "eu-central-1";
const dynamoDbClient = new DynamoDB({ region });

const getAllDynamoDBItems = async () => {
  const command = new ScanCommand({
    TableName: tableName,
  });
  return await dynamoDbClient.send(command);
};

const createResponse = (statusCode: number, body: Object): APIGatewayProxyResult => ({
  statusCode,
  body: JSON.stringify(body),
});

// Handler
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const response = await getAllDynamoDBItems();
    console.log(response);

    return createResponse(200, { message: "ok - items found", data: response });
  } catch (error) {
    console.error(error);
    return createResponse(500, { message: "ERROR something went wrong!", error });
  }
};
