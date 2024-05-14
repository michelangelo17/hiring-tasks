#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { LambdaNodeCdkStack } from "../lib/lambda-node-cdk-stack";

const app = new cdk.App();
new LambdaNodeCdkStack(app, "LambdaNodeCdkStack", { env: { region: process.env.REGION } });
