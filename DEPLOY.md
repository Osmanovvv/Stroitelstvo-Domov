# Деплой на VPS (тестовый сервер)

Стек: Next.js 15 + PostgreSQL + Prisma. Нужен **Node 20+**, **PostgreSQL**,
**PM2** и **nginx**. Инструкция для Ubuntu 22/24 (с правами sudo).

> ⚠️ ВАЖНО про ветку. Основная ветка репозитория (`main`) на GitHub — это
> СТАРЫЙ codex-прототип, НЕ этот сайт. Клонируйте ветку
> **`claude/checkpoint-2026-06-23`** (актуальная версия), как показано ниже.

---

## 1. Установить окружение (если ещё не стоит)

```bash
# Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL, nginx
sudo apt-get install -y postgresql nginx

# PM2 глобально
sudo npm install -g pm2
```

## 2. Создать базу данных

```bash
sudo -u postgres psql <<'SQL'
CREATE DATABASE svm;
CREATE USER svm_user WITH PASSWORD 'СЛОЖНЫЙ_ПАРОЛЬ';
GRANT ALL PRIVILEGES ON DATABASE svm TO svm_user;
\c svm
GRANT ALL ON SCHEMA public TO svm_user;
SQL
```

## 3. Получить код (нужную ветку!)

```bash
sudo mkdir -p /var/www && cd /var/www
sudo chown -R $USER:$USER /var/www
git clone -b claude/checkpoint-2026-06-23 https://github.com/Osmanovvv/Stroitelstvo-Domov.git svm-landing
cd svm-landing
```

## 4. Прод-окружение

```bash
cp .env.production.example .env.production
nano .env.production   # DATABASE_URL, AUTH_SECRET, ADMIN_PASSWORD_HASH, TELEGRAM_*
```
- `AUTH_SECRET`: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `ADMIN_PASSWORD_HASH`: `node -e "console.log(require('bcryptjs').hashSync('ВАШ_ПАРОЛЬ',10))"`
  (в `.env.production` символы `$` экранируйте как `\$`)
- `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID`: боевой бот от @BotFather + chat_id получателя заявок (инструкция в `.env.production.example`). Без них заявки не уйдут в Telegram.
- Пока без HTTPS оставьте `ALLOW_INSECURE_COOKIES="1"` (иначе не зайти в админку по HTTP).
- ⚠️ Деплойте ТОЛЬКО `.env.production` — файл `.env` (dev-секреты) на прод не копируйте.

## 5. Установка, миграции, сборка

```bash
npm ci
npx prisma migrate deploy          # применить миграции (без сброса данных)
FORCE_SEED=1 npm run db:seed        # один раз — наполнить демо-контентом
npm run build
```
> Сид (`db:seed`) СТИРАЕТ все данные и заливает демо. Запускайте только при первом
> деплое (или когда осознанно нужно сбросить контент). На последующих обновлениях —
> НЕ запускайте, иначе сотрёте правки, сделанные в админке.

## 6. Запуск через PM2

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup    # выполнить выведенную команду, чтобы PM2 поднимался после ребута
```
Приложение слушает `127.0.0.1:3000`.

## 7. nginx

```bash
sudo cp deploy/nginx.example.conf /etc/nginx/sites-available/svm-landing
sudo nano /etc/nginx/sites-available/svm-landing   # server_name + путь к /uploads
sudo ln -s /etc/nginx/sites-available/svm-landing /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```
Открыть в браузере: `http://ВАШ_ДОМЕН_ИЛИ_IP`. Сайт — `/`, админка — `/admin`.

## 8. HTTPS (рекомендуется перед показом по домену)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d test.example.com
```
После этого в `.env.production` уберите `ALLOW_INSECURE_COOKIES` и `pm2 reload svm-landing`.

---

## Обновление версии (после новых правок)

```bash
cd /var/www/svm-landing
git pull origin claude/checkpoint-2026-06-23
npm ci
npx prisma migrate deploy
npm run build
pm2 reload svm-landing
# db:seed НЕ запускать — сотрёт контент админки!
```

## После первого деплоя (обязательно)
- **SEO → домен**: в админке → «SEO» впишите реальный **адрес сайта (домен)** — от него строятся canonical, sitemap и OpenGraph (по умолчанию стоит тестовый IP). Там же — коды подтверждения Яндекс.Вебмастер / Google Search Console.
- **Настройки**: заполните телефон, ссылки мессенджеров и реквизиты оператора ПДн («Настройки»).
- **Проверьте заявки**: отправьте тестовую заявку с сайта → должна прийти в Telegram и появиться в разделе «Заявки».

## Заметки
- Порядок при деплое строгий: сначала доступная БД + `prisma migrate deploy`, **потом** `npm run build` (главная пре-рендерится с данными из БД — без неё сборка упадёт).
- **Фото из админки** хранятся в `public/uploads/` (на постоянном диске) — при обновлениях
  не трогаются (папка вне git). nginx отдаёт их напрямую с кэшем.
- **Файлы из заявок** — в `private-uploads/` (вне `public/`, git-ignore): это ПДн, публично НЕ раздаются, скачиваются только из админки. Папка постоянная, при обновлениях не трогается.
- Часовой пояс статуса работы — Europe/Moscow (в коде), от сервера не зависит.
- Реквизиты оператора ПДн и контакты заполняются в админке («Настройки»).
