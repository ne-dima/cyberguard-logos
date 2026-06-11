#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -f .env ]; then
  echo "Создайте .env из .env.production.example"
  exit 1
fi

# shellcheck disable=SC1091
set -a
source .env
set +a

STAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_DIR="${BACKUP_DIR:-$ROOT/backups}"
mkdir -p "$BACKUP_DIR"

DB_FILE="$BACKUP_DIR/postgres_${STAMP}.sql.gz"
UPLOADS_FILE="$BACKUP_DIR/uploads_${STAMP}.tar.gz"

echo "Backup PostgreSQL -> $DB_FILE"
docker compose exec -T db pg_dump -U "${POSTGRES_USER:-cyber}" "${POSTGRES_DB:-cyber_intensive}" | gzip >"$DB_FILE"

echo "Backup uploads volume -> $UPLOADS_FILE"
docker compose run --rm -v uploads_data:/data:ro -v "$BACKUP_DIR":/backup alpine \
  tar -czf "/backup/uploads_${STAMP}.tar.gz" -C /data .

echo "Done."
ls -lh "$DB_FILE" "$UPLOADS_FILE"
