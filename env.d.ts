declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GLOBAL_PREFIX: string;
      APP_PORT: string;
      APP_NAME: string;
      SWAGGER_PATH: string;
      SWAGGER_ENABLE: string;
      POSTGRES_URL: string;
      JWT_SECRET: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      REDIS_PASSWORD: string;
      REDIS_DB: string;
    }
  }
}

export {};
