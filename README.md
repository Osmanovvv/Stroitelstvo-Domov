# Brick Houses Landing

Landing page prototype for brick house construction and ready home sales.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run start
```

## Админ-панель

Редактирование наполнения сайта (готовые дома, дома в строительстве, проекты,
участки, цены, FAQ, настройки) доступно в разделе `/admin`. Данные хранятся в
PostgreSQL, публичный сайт читает их из базы.

### Запуск локально

1. Поднять PostgreSQL (Docker):

   ```bash
   docker run --name svm-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=svm -p 5432:5432 -d postgres:16
   ```

2. Создать `.env` по образцу `.env.example`:

   - `DATABASE_URL` — строка подключения к базе.
   - `ADMIN_USERNAME` — логин администратора.
   - `ADMIN_PASSWORD_HASH` — bcrypt-хэш пароля. **Символы `$` в хэше нужно
     экранировать как `\$`** (иначе Next.js испортит значение). Хэш можно получить:
     `node -e "console.log(require('bcryptjs').hashSync('ваш_пароль',10))"`.
   - `AUTH_SECRET` — случайная строка для подписи сессии:
     `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

3. Применить схему и наполнить базу текущим контентом:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. `npm run dev` → сайт на `http://localhost:3000`, админка на `/admin`.

Загруженные через админку фото сохраняются в `public/uploads/` (папка в `.gitignore`).

### Деплой на VPS (Beget)

Нужен Node + PostgreSQL. После заливки проекта и настройки прод-`.env`:
`prisma migrate deploy`, `npm run db:seed` (один раз), `npm run build`, запуск через
PM2 (`npm start`). Папка `public/uploads/` должна быть на постоянном диске.

## Netlify

For Git-based deploys, use:

- Build command: `npm run build`
- Publish directory: `.next`

