// https://docs.aws.amazon.com/vpn/latest/clientvpn-admin/client-auth-mutual-enable.html
// https://catalog.us-east-1.prod.workshops.aws/workshops/be2b90c2-06a1-4ae6-84b3-c705049d2b6f/ja-JP/03-hands-on/03-01-common/04-certificate

import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as logs from 'aws-cdk-lib/aws-logs';

export interface ClientVpnProps {
  vpc: ec2.IVpc;
  clientSecurityGroup: ec2.ISecurityGroup;
}

export class ClientVPN extends Construct {
  constructor(scope: Construct, id: string, props: ClientVpnProps) {
    super(scope, id);
    const logGroup = new logs.LogGroup(this, 'ClientVpnLogGroup', {
      logGroupName: '/aws/clientvpn',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const logStream = new logs.LogStream(this, 'ClientVpnLogStream', {
      logGroup,
      logStreamName: 'client-vpn-stream',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const vpnSecurityGroup = new ec2.SecurityGroup(this, 'VpnSecurityGroup', {
      vpc: props.vpc,
      description: 'Security group for Client VPN SSH/RDP egress',
      allowAllOutbound: false,
    });
    vpnSecurityGroup.addEgressRule(ec2.Peer.ipv4(props.vpc.vpcCidrBlock), ec2.Port.tcp(22), 'SSH');
    vpnSecurityGroup.addEgressRule(ec2.Peer.ipv4(props.vpc.vpcCidrBlock), ec2.Port.tcp(3389), 'RDP');
    const clientVpnEndpoint = new ec2.ClientVpnEndpoint(this, 'ClientVpnEndpoint', {
      vpc: props.vpc,
      cidr: '10.1.0.0/16',
      serverCertificateArn: 'arn:aws:acm:ap-northeast-1:395453697891:certificate/87715d14-d9d8-46d3-8763-ea54e980638e',
      clientCertificateArn: 'arn:aws:acm:ap-northeast-1:395453697891:certificate/8381c5a3-34e6-4609-84df-28bf362540d1',
      logging: true,
      logGroup,
      logStream,
      splitTunnel: true,
      vpcSubnets: {
        subnetGroupName: 'PrivateSubnet',
      },
      securityGroups: [props.clientSecurityGroup, vpnSecurityGroup],
    });
  }
}