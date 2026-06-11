# TLS для cyberguard.logos.ru

Положите **ровно два файла** в эту папку (как у priem-logos.ru):

| Файл на диске | Что это |
|---------------|---------|
| **`fullchain.pem`** | Сертификат сайта **+** цепочка (CA), один PEM-файл |
| **`privkey.pem`** | Приватный ключ |

## Полный путь на сервере

```
/home/user/cyberguard-logos/ssl/cyberguard.logos.ru/fullchain.pem
/home/user/cyberguard-logos/ssl/cyberguard.logos.ru/privkey.pem
```

## Права доступа

```bash
chmod 644 /home/user/cyberguard-logos/ssl/cyberguard.logos.ru/fullchain.pem
chmod 600 /home/user/cyberguard-logos/ssl/cyberguard.logos.ru/privkey.pem
```

## После загрузки файлов

Перезагрузите nginx (другие сайты не перезапускаются):

```bash
docker exec logos-class-nginx nginx -t && docker exec logos-class-nginx nginx -s reload
```

## Если файлы пришли с другими именами

Переименуйте или скопируйте, например:

```bash
cd /home/user/cyberguard-logos/ssl/cyberguard.logos.ru
cp certificate.pem fullchain.pem    # сертификат + цепочка
cp private.key privkey.pem            # приватный ключ
chmod 644 fullchain.pem && chmod 600 privkey.pem
docker exec logos-class-nginx nginx -t && docker exec logos-class-nginx nginx -s reload
```

Nginx читает эту папку из контейнера как `/etc/nginx/ssl/cyberguard.logos.ru/`.
