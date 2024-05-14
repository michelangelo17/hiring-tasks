#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { LambdaNodeCdkStack } from "../lib/lambda-node-cdk-stack";
import * as dotenv from "dotenv";
import { AwsSolutionsChecks } from "cdk-nag";

dotenv.config();

const app = new cdk.App();
cdk.Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
// Edit: shouldn't use .env file for region in PROD, but it works for testing,
console.log(process.env.REGION);
new LambdaNodeCdkStack(app, "LambdaNodeCdkStack", { env: { region: process.env.REGION || "eu-central-1" } });
