#!/bin/bash
cd "${CDK_APP}" && npm ci && cd - ;
devcontainer templates apply --template-id ghcr.io/katohirosato/aws-dev/aws-dev --omit-paths '[".git/*","README.md",".github/workflows/template.yaml","devcontainer-template.json","history.sh", "startup.sh", ".devcontainer/config", ".devcontainer/devcontainer.env"]';
