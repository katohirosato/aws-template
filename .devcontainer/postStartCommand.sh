devcontainer templates apply --template-id ghcr.io/katohirosato/aws-dev/aws-dev --omit-paths '[ \
".git/*", \
"README.md", \
".github/workflows/tempalte.yaml", \
"devcontainer-template.json", \
"history.sh", \
"devcontainer/config" \
]'
cd ${CDK_APP}
npm ci
cd -