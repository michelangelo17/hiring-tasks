import { Stack, StackProps } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";

export class LambdaNodeCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Creates a new DynamoDB table, primary partition key: 'id'
    const table = new Table(this, "MyTable", {
      partitionKey: { name: "id", type: AttributeType.STRING },
    });
    // Creates a new Node.js Lambda function, passing the table name as an environment variable
    // missing, permissions to access the DynamoDB table
    new NodejsFunction(this, "MyFunc", {
      runtime: Runtime.NODEJS_16_X,
      handler: "handler",
      entry: "lib/lambda-node.ts",
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // function code is looking for an api gateway event, but no api gateway is created
  }
}
