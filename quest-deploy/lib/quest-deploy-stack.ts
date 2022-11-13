import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { Duration } from 'aws-cdk-lib';

export class QuestDeployStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const tag = this.node.tryGetContext('TAG');
    if (!tag) {
      throw new Error('Missing tag');
    }

    const secretWord = this.node.tryGetContext('SECRET_WORD') || 'DefaultSecret';

    const vpc = new ec2.Vpc(this, 'Vpc');
    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc: vpc,
      capacity: {
        instanceType: new ec2.InstanceType('t2.micro'),
        desiredCapacity: 2,
      }
    });

    const image = ecs.ContainerImage.fromRegistry(`index.docker.io/alexenelson/quest:${tag}`);

    const service = new ecsPatterns.ApplicationLoadBalancedEc2Service(this, 'Service', {
      cluster: cluster,
      memoryLimitMiB: 512,
      cpu: 256,
      desiredCount: 1,
      taskImageOptions: {
        image: image,
        environment: {
          SECRET_WORD: secretWord,
        },
      },
      certificate: acm.Certificate.fromCertificateArn(this, 'Certificate',
        'arn:aws:acm:us-east-1:987334205533:certificate/a2f09ebd-9f0e-4f32-ab47-b81304f56226'),
    });

    service.targetGroup.configureHealthCheck({
      timeout: Duration.seconds(30),
      interval: Duration.seconds(60),
    });
  }
}
