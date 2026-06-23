// Конфиг PM2 для запуска прод-сборки Next.js.
// Запуск:  pm2 start ecosystem.config.cjs
// Перезапуск после деплоя:  pm2 reload svm-landing
module.exports = {
  apps: [
    {
      name: "svm-landing",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
    },
  ],
};
