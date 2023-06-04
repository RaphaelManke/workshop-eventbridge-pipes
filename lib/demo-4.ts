import { SqsSource, LogsTarget, Pipe, PipeInputTransformation, PipeGenericFilterPattern, LambdaEnrichment, PipeSourceFilter } from "@raphaelmanke/aws-cdk-pipes-rfc";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

export class DemoPipe extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const queue = new Queue(this, 'Queue');
    const loggroup = new LogGroup(this, 'LogGroup');

    const pipeSource = new SqsSource(queue);
    const sourceFilterPattern = PipeGenericFilterPattern.fromJson({
      body: {
        orderId: [{ exists: true }],
        productId: [{ exists: true }],
      },
    });
    const sourceFilter = new PipeSourceFilter([sourceFilterPattern]);

    const enrichmentLambda = new NodejsFunction(this, 'EnrichmentLambda', {
      entry: 'lib/enrichment.handler.ts',
      runtime: Runtime.NODEJS_18_X
    })

    const pipeEnrichment = new LambdaEnrichment(enrichmentLambda)

    const pipeTarget = new LogsTarget(loggroup, {
      inputTemplate: PipeInputTransformation.fromJson({
        "orderId" : "<$.orderId>",
        "productId" : "<$.productData.id>",
        "productPrice" : "<$.productData.price>",
        "productTitle" : "<$.productData.title>",
      })
    })

    new Pipe(this, 'Pipe', {
      source: pipeSource,
      filter: sourceFilter,
      enrichment: pipeEnrichment,
      target: pipeTarget
    })
  }
}