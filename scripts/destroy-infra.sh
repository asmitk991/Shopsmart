#!/usr/bin/env bash
set -euo pipefail

echo "=== Destroying Terraform infrastructure ==="
cd "$(dirname "$0")/../infra"

terraform init -input=false
terraform destroy -auto-approve \
  -var="db_password=${TF_VAR_db_password:-placeholder}"

echo "=== Infrastructure destroyed ==="
