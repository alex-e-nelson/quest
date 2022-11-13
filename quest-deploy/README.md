# Deployment

This is a CDK project written in typescript that contains one stack `QuestDeployStack`

## Setup
The `QuestDeployStack` contains a reference to one external AWS resource, self signed certificates
for the load balancer provided by `tls.crt` and `tls.key`. You must first import the self signed
certificates to AWS certificate manager before performing the following steps.

1. Bootstrap the region you wish to deploy in.
**This step only needs to be performed once**
```
npx cdk bootstrap aws://{ACCOUNT}/{REGION}
```

2. Run the deployment. The docker image tag is a required context parameter. You must provide a tag for a valid docker image
in dockerhub repository https://hub.docker.com/r/alexenelson/quest/tags.
```
npx cdk deploy -c TAG={TAG}
```

## CICD
A simple CICD workflow is provided by a github action found at `{REPOSITORY_ROOT}/.github/workflows/docker-image.yml`.
This workflow performs the following steps.

1. Docker build
2. Docker push
3. CDK deploy