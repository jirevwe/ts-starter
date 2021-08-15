#!/bin/bash

# Exit script if you try to use an uninitialized variable.
set -o nounset

# Exit script if a statement returns a non-true return value.
set -o errexit

# Use the error status of the first failure, rather than that of the last item in a pipeline.
set -o pipefail

# Install make
apk --no-cache add make

# login to ACR, build image and push to registry
make push

# Decode Kubeconfig
echo $KUBECONFIG | base64 -d > kubeconfig

export KUBECONFIG=./kubeconfig

# Deploy app to K8s cluster with helm
make deploy

# Clean up resources
make clean