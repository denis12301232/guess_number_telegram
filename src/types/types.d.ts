declare namespace NodeJS {
   interface ProcessEnv {
      readonly BOT_TOKEN: string;
      readonly DB_URL: string;
      readonly SERVER_URL: string;
      readonly PORT: number;
   }
}