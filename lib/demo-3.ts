import { SqsSource, LogsTarget, Pipe, PipeEnrichment, LambdaEnrichment } from "@raphaelmanke/aws-cdk-pipes-rfc";
import { Stack } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

export class DemoPipe extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const queue = new Queue(this, 'Queue');
    const loggroup = new LogGroup(this, 'LogGroup');

    const pipeSource = new SqsSource(queue)

    const enrichmentLambda = new NodejsFunction(this, 'EnrichmentLambda', {
      entry: 'lib/enrichment.handler.ts',
    })

    const pipeEnrichment = new LambdaEnrichment(enrichmentLambda)


    const pipeTarget = new LogsTarget(loggroup)

    new Pipe(this, 'Pipe', {
      source: pipeSource,
      enrichment: pipeEnrichment,
      target: pipeTarget
    })
  }
}