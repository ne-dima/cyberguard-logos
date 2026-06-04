# КиберСтраж

Сайт отбора участников программы «КиберСтраж» по информационной безопасности в техническом колледже «ЛОГОС».

Стек: **Next.js (App Router)**, **TypeScript**, **TailwindCSS**, **PostgreSQL**, **Prisma**, **Docker**.

## Быстрый старт (разработка)

### 1. PostgreSQL

Запустите только базу в Docker:

```bash
cp .env.example .env.local
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

Если в `data/applications.json` есть записи с прежней файловой схемы:

```bash
npm run db:import-json
```

Фото из `data/uploads/` продолжают работать без изменений.

## Продакшен (Docker Compose)

Полный стек: приложение + PostgreSQL + том для фото.

```bash
cp .env.example .env
# Обязательно смените ADMIN_PASSWORD и POSTGRES_PASSWORD в .env
docker compose up -d --build
```

Сайт: [http://localhost:3000](http://localhost:3000) (порт задаётся `APP_PORT`).

При старте контейнера `app` автоматически выполняется `prisma migrate deploy`.

### Чеклист перед открытием приёма

- [ ] Сильные пароли в `.env`: `ADMIN_PASSWORD`, `POSTGRES_PASSWORD`
- [ ] `EMAIL_MODE=smtp` и рабочий SMTP
- [ ] HTTPS перед прокси (nginx/Caddy) — cookie админа с флагом `secure`
- [ ] Регулярный бэкап: `pg_dump` + каталог тома `uploads_data`
- [ ] Импорт legacy-данных: `npm run db:import-json` (один раз, при необходимости)

## Страницы

| URL | Описание |
|-----|----------|
| `/` | Главная, опрос, форма регистрации |
| `/status` | Статус заявки по email |
| `/admin` | Админ-панель |

## Админ-панель

- URL: [http://localhost:3000/admin](http://localhost:3000/admin)
- Логин/пароль — из `ADMIN_USERNAME` / `ADMIN_PASSWORD` (см. `.env.example`)

Возможности: просмотр заявок, фильтры, принять/отклонить, экспорт Excel, вкладка «Приглашения».

## Переменные окружения

Скопируйте `.env.example` в `.env.local` (разработка) или `.env` (Docker Compose):

| Переменная | Описание |
|------------|----------|
| `DATABASE_URL` | Строка подключения PostgreSQL |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Учётные данные БД в Compose |
| `UPLOADS_DIR` | Каталог фото (в Docker: `/app/data/uploads`) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Админ-панель |
| `EMAIL_MODE` | `mock` — в консоль, `smtp` — nodemailer |
| `EMAIL_FROM`, `SMTP_*` | Параметры почты |

## Почта

По умолчанию письма выводятся в **консоль** (`EMAIL_MODE=mock`). Для продакшена задайте `EMAIL_MODE=smtp` и SMTP в `.env`.

## Данные проекта

| Хранилище | Содержимое |
|-----------|------------|
| **PostgreSQL** | Заявки, статусы, согласия, даты |
| **Том `uploads_data`** (Docker) или `data/uploads/` | Фото профилей |
| `data/partners.json` | Партнёры на главной (статический JSON) |
| `localStorage` (браузер) | Прогресс опроса (не на сервере) |
| `data/applications.json` | Legacy; только для `npm run db:import-json` |

## Скрипты

```bash
npm run dev                 # разработка
npm run build               # production-сборка
npm run start               # Node без Docker (нужен DATABASE_URL)
npm run lint                # ESLint

npm run db:migrate          # миграции (dev)
npm run db:migrate:deploy   # миграции (prod/CI)
npm run db:import-json      # импорт из applications.json

npm run docker:up           # docker compose up -d --build
npm run docker:down         # остановить контейнеры
npm run docker:logs         # логи приложения
```

## Структура

```
src/
  app/              # роутинг и API
  components/       # React-компоненты
  lib/              # Prisma, email, валидация
  content/          # статический контент
prisma/             # схема и миграции PostgreSQL
docker/             # entrypoint для контейнера
data/uploads/       # фото (volume в Docker)
public/             # статические файлы
```

План разработки — в [`cursor.md`](cursor.md).
