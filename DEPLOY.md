# Деплой КиберСтраж (production)

## 1. Подготовка сервера

- Linux с Docker и Docker Compose v2
- Домен с DNS на сервер
- TLS (Caddy или nginx + Let's Encrypt)

## 2. Конфигурация

```bash
cd cyberguard-logos
cp .env.production.example .env
chmod +x scripts/generate-secrets.sh scripts/backup.sh
./scripts/generate-secrets.sh   # вставьте значения в .env
```

Заполните в `.env`:

| Переменная | Требование |
|------------|------------|
| `APP_URL` | Публичный HTTPS URL, например `https://cyber.logos.ru` |
| `POSTGRES_PASSWORD` | Сильный пароль (не из примера) |
| `ADMIN_PASSWORD` | ≥12 символов |
| `ADMIN_SESSION_SECRET` | ≥32 символа (случайная строка) |
| `EMAIL_MODE` | `smtp` |
| `SMTP_*` | Рабочий SMTP |
| `TRUST_PROXY` | `true` за reverse-proxy |

Проверка перед запуском:

```bash
npm install
npm run prod:check
```

## 3. Запуск

**Рекомендуется** (БД без порта на хосте, приложение только на localhost):

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Только для отладки на одном хосте:

```bash
docker compose up -d --build
```

Проверка:

```bash
curl -s http://127.0.0.1:3000/api/health
docker compose ps
docker compose logs -f app
```

## 4. TLS-сертификат (Yandex / свой CA)

Два файла в каталог:

`ssl/cyberguard.logos.ru/fullchain.pem` — сертификат и цепочка  
`ssl/cyberguard.logos.ru/privkey.pem` — приватный ключ  

Подробнее: [ssl/cyberguard.logos.ru/README.md](ssl/cyberguard.logos.ru/README.md)

```bash
docker exec logos-class-nginx nginx -t && docker exec logos-class-nginx nginx -s reload
```

## 5. Reverse-proxy

- Caddy: [`deploy/Caddyfile.example`](deploy/Caddyfile.example)
- nginx: [`deploy/nginx.conf.example`](deploy/nginx.conf.example)

После настройки TLS откройте `APP_URL` в браузере и войдите в `/admin`.

## 6. Бэкапы

```bash
./scripts/backup.sh
```

Рекомендуется cron, например ежедневно в 03:00.

## 7. Обновление версии

```bash
git pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Миграции применяются автоматически при старте контейнера `app`.

## 8. Импорт legacy-данных (один раз)

```bash
docker compose exec app node ./node_modules/prisma/build/index.js migrate deploy
# или с хоста при наличии DATABASE_URL:
npm run db:import-json
```
