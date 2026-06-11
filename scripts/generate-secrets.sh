#!/usr/bin/env bash
set -euo pipefail

echo "# Скопируйте значения в .env"
echo ""
echo "POSTGRES_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=' | head -c 32)"
echo "ADMIN_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=' | head -c 20)"
echo "ADMIN_SESSION_SECRET=$(openssl rand -base64 48 | tr -d '/+=' | head -c 48)"
