import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class QuestDeployStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc');
    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc: vpc,
      capacity: {
        instanceType: new ec2.InstanceType('t2.micro'),
        desiredCapacity: 1,
      }
    });

    const service = new ecsPatterns.ApplicationLoadBalancedEc2Service(this, 'Service', {
      cluster: cluster,
      memoryLimitMiB: 512,
      cpu: 256,
      desiredCount: 1,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('index.docker.io/alexenelson/quest:latest'),
      },
    });
  }
}
