import {
  SqsSource,
  LogsTarget,
  Pipe,
  PipeSourceFilter,
  PipeGenericFilterPattern,
} from "@raphaelmanke/aws-cdk-pipes-rfc";
import { Stack } from "aws-cdk-lib";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

export class DemoPipe extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const queue = new Queue(this, "Queue");
    const loggroup = new LogGroup(this, "LogGroup");

    const pipeSource = new SqsSource(queue);
    const sourceFilterPattern = PipeGenericFilterPattern.fromJson({
      body: {
        orderId: [{ exists: true }],
        productId: [{ exists: true }],
      },
    });

    const sourceFilter = new PipeSourceFilter([sourceFilterPattern]);

    const pipeTarget = new LogsTarget(loggroup);

    new Pipe(this, "Pipe", {
      source: pipeSource,
      filter: sourceFilter,
      target: pipeTarget,
    });
  }
}
