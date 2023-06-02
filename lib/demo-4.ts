import { SqsSource, LogsTarget, Pipe, PipeInputTransformation } from "@raphaelmanke/aws-cdk-pipes-rfc";
import { Stack } from "aws-cdk-lib";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

export class DemoPipe extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const queue = new Queue(this, 'Queue');
    const loggroup = new LogGroup(this, 'LogGroup');

    const pipeSource = new SqsSource(queue)
    const pipeTarget = new LogsTarget(loggroup, {
      inputTemplate: PipeInputTransformation.fromJson({
        "orderPrice" : "<$.price>"
      })
    })

    new Pipe(this, 'Pipe', {
      source: pipeSource,
      target: pipeTarget
    })
  }
}