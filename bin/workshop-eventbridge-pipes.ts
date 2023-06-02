#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WorkshopEventbridgePipesStack } from '../lib/workshop-eventbridge-pipes-stack';

const app = new cdk.App();
new WorkshopEventbridgePipesStack(app, 'WorkshopEventbridgePipesStack', {
});