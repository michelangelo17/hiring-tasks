import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { LambdaConstruct } from "./constructs/lambdaFunctions";

export class LambdaNodeCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Creates a new DynamoDB table, primary partition key: 'id'
    const table = new Table(this, "MyTable", {
      partitionKey: { name: "id", type: AttributeType.STRING },
    });

    // Creates a new Node.js Lambda function, scanning the table for all items
    // const scanItemsLambdaFunction = new LambdaConstruct(this, "ScanItemsLambda", {
    //   entry: "lib/lambdas/scanItems.ts",
    //   tableName: table.tableName,
    // });

    // Creates a new Node.js Lambda function, getting an item by id from the table
    const getItemByIdLambdaFunction = new LambdaConstruct(this, "GetItemLambda", {
      entry: "lib/lambdas/getItemById.ts",
      tableName: table.tableName,
    });

    // Creates a new Node.js Lambda function, to create a new item in the table
    // const createItemLambdaFunction = new LambdaConstruct(this, "CreateItemLambda", {
    //   entry: "lib/lambdas/createItem.ts",
    //   tableName: table.tableName,
    // });

    // Creates a new Node.js Lambda function, to update an item in the table
    const updateItemLambdaFunction = new LambdaConstruct(this, "UpdateItemLambda", {
      entry: "lib/lambdas/updateItem.ts",
      tableName: table.tableName,
    });

    // Creates a new Node.js Lambda function, to delete an item in the table
    const deleteItemLambdaFunction = new LambdaConstruct(this, "DeleteItemLambda", {
      entry: "lib/lambdas/deleteItem.ts",
      tableName: table.tableName,
    });

    // Grants the Lambda functions read access to the DynamoDB table
    // table.grantReadData(scanItemsLambdaFunction);
    table.grantReadData(getItemByIdLambdaFunction);

    // Grants the Lambda functions write access to the DynamoDB table
    // table.grantReadWriteData(createItemLambdaFunction);
    table.grantReadWriteData(updateItemLambdaFunction);
    table.grantReadWriteData(deleteItemLambdaFunction);

    // Creates a new API Gateway REST API
    const api = new RestApi(this, "MyApi", {});

    // Adds a new resource 'items' to the API
    const items = api.root.addResource("items");
    // get all items
    // items.addMethod("GET", new LambdaIntegration(scanItemsLambdaFunction.lambdaFunction));
    // create new item
    // items.addMethod("POST", new LambdaIntegration(createItemLambdaFunction.lambdaFunction));

    // Adds a new resource 'items/{id}' to the API
    const singleItem = items.addResource("{id}");

    // get single item by id
    singleItem.addMethod("GET", new LambdaIntegration(getItemByIdLambdaFunction.lambdaFunction));
    // update single item by id
    singleItem.addMethod("PUT", new LambdaIntegration(updateItemLambdaFunction.lambdaFunction));
    // delete single item by id
    singleItem.addMethod("DELETE", new LambdaIntegration(deleteItemLambdaFunction.lambdaFunction));

    // Prints out the API endpoint to the terminal
    new CfnOutput(this, "ApiEndpoint", {
      value: api.url ?? "Something went wrong with the deploy",
    });
    // Prints out the table name to the terminal
    new CfnOutput(this, "TableName", {
      value: table.tableName,
    });
  }
}
