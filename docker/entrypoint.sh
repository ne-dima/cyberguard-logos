#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ] && [ -f ./prisma/schema.prisma ]; then
  echo "Applying database migrations..."
  if ! node ./node_modules/prisma/build/index.js migrate deploy 2>/dev/null; then
    echo "WARN: prisma migrate deploy failed — run manually: npx prisma migrate deploy"
  fi
fi

if [ ! -w "$UPLOADS_DIR" ]; then
  echo "ERROR: UPLOADS_DIR ($UPLOADS_DIR) is not writable."
  exit 1
fi

echo "Starting application (NODE_ENV=$NODE_ENV)..."
exec node server.js
