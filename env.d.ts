// Типизация обязательных переменных окружения проекта.
declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    AUTH_SECRET: string;
    ADMIN_USERNAME: string;
    ADMIN_PASSWORD_HASH: string;
  }
}
