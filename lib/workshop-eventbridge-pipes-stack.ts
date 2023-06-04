import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';


import { DemoPipe } from './demo-4';
export class WorkshopEventbridgePipesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new DemoPipe(this, 'DemoPipe')
  }
}
