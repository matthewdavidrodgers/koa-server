export interface IConfig {
  port: number;
  env: string;
}

const config: IConfig = {
  port: parseInt(process.env.PORT) || 3000,
  env: process.env.NODE_ENV || 'dev'
};

export default config;

