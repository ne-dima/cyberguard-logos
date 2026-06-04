#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ] && [ -f ./prisma/schema.prisma ]; then
  echo "Applying database migrations..."
  node ./node_modules/prisma/build/index.js migrate deploy
fi

echo "Starting application..."
exec node server.js
