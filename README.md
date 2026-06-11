# КиберСтраж

Сайт отбора участников программы «КиберСтраж» по информационной безопасности в техническом колледже «ЛОГОС».

Стек: **Next.js (App Router)**, **TypeScript**, **TailwindCSS**, **PostgreSQL**, **Prisma**, **Docker**.

## Быстрый старт (разработка)

### 1. PostgreSQL

```bash
cp .env.example .env.local
cp .env.example .env          # для docker compose
docker compose up db -d
```

В `.env.local` должны совпадать `POSTGRES_*` и `DATABASE_URL` (хост `localhost`, порт `5432`).

### 2. Миграции и приложение

```bash
npm install
npm run db:migrate
npm run dev
```

Откройте: [http://localhost:3000](http://localhost:3000)

### Импорт старых заявок из JSON

```bash
npm run db:import-json
```

## Продакшен

Полная инструкция: **[DEPLOY.md](DEPLOY.md)**

```bash
cp .env.production.example .env
./scripts/generate-secrets.sh    # подставить секреты в .env
# Заполнить APP_URL, SMTP_*, EMAIL_FROM
npm run prod:check
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

- Health: `GET /api/health`
- TLS через Caddy/nginx — примеры в [`deploy/`](deploy/)
- Бэкап: `./scripts/backup.sh`

### Чеклист перед открытием приёма

- [ ] `npm run prod:check` без ошибок
- [ ] `APP_URL` — HTTPS-домен
- [ ] Сильные `ADMIN_PASSWORD`, `POSTGRES_PASSWORD`, `ADMIN_SESSION_SECRET`
- [ ] `EMAIL_MODE=smtp`, рабочий SMTP
- [ ] `TRUST_PROXY=true` за reverse-proxy
- [ ] Cron для `./scripts/backup.sh`

## Страницы

| URL | Описание |
|-----|----------|
| `/` | Главная, опрос, форма регистрации |
| `/status` | Статус заявки по email |
| `/admin` | Админ-панель |

## Переменные окружения

| Переменная | Описание |
|------------|----------|
| `APP_URL` | Публичный URL сайта (обязателен в production) |
| `DATABASE_URL` | PostgreSQL (локальная разработка) |
| `POSTGRES_*` | Учётные данные БД в Docker |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Админ-панель |
| `ADMIN_SESSION_SECRET` | Подпись сессии (≥32 символа) |
| `TRUST_PROXY` | `true` за nginx/Caddy |
| `EMAIL_MODE` | `mock` (dev) / `smtp` (prod) |
| `SMTP_*`, `EMAIL_FROM` | Почта |
| `NEXT_PUBLIC_YANDEX_CAPTCHA_CLIENT_KEY` | Ключ клиента Яндекс Smart Captcha |
| `YANDEX_CAPTCHA_SERVER_KEY` | Серверный ключ капчи (секрет) |

Примеры: [`.env.example`](.env.example) (dev), [`.env.production.example`](.env.production.example) (prod).

## Скрипты

```bash
npm run dev
npm run build
npm run start
npm run lint

npm run db:migrate
npm run db:migrate:deploy
npm run db:import-json

npm run prod:check          # проверка .env перед деплоем
npm run prod:up             # docker prod (compose + prod override)
npm run prod:down

npm run docker:up           # docker compose up (dev-режим)
npm run docker:logs
./scripts/backup.sh
```

## Структура

```
src/
  app/              # роутинг и API
  lib/security/     # rate limit, CSRF, сессии
  lib/config/       # production checks, APP_URL
deploy/             # примеры Caddy / nginx
docker/             # entrypoint
prisma/
data/uploads/
```
