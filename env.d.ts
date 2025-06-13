declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GLOBAL_PREFIX: string;
      APP_PORT: string;
      APP_NAME: string;
      SWAGGER_PATH: string;
      SWAGGER_ENABLE: string;
      SWAGGER_WRAP_RESPONSE: string;
      POSTGRES_URL: string;
      JWT_SECRET: string;
      JWT_EXPIRE: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      REDIS_PASSWORD: string;
      REDIS_DB: string;
      REDIS_PREFIX: string;
      FILE_DOMAIN: string;
      UPLOAD_BASE_DIR: string;
      UPLOAD_MAX_SIZE: string;
      STATIC_PREFIX: string;
    }
  }
}

export {};
