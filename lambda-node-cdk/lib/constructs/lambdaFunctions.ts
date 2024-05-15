import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { IGrantable } from "aws-cdk-lib/aws-iam";

export interface CustomProps {
  entry: string;
  tableName: string;
}

export class LambdaConstruct extends Construct implements IGrantable {
  public readonly lambdaFunction: NodejsFunction;

  constructor(scope: Construct, id: string, props: CustomProps) {
    super(scope, id);

    this.lambdaFunction = new NodejsFunction(this, "MyCustomLambda", {
      runtime: Runtime.NODEJS_18_X,
      handler: "index.handler",
      entry: props.entry,
      environment: {
        TABLE_NAME: props.tableName,
        REGION: process.env.REGION || "eu-central-1",
      },
    });
  }

  public get grantPrincipal() {
    return this.lambdaFunction.role!;
  }
}
