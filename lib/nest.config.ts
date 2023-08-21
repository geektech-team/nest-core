import { LOG_PATH, USER_ID_KEY, TOKEN_KEY } from './constants';
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const configPath = join(process.env.PWD, "nest.config.json");
const defaultConfig = {
  [LOG_PATH]: './log',
  [USER_ID_KEY]: 'DEFAULT_CACHE_KEY',
  [TOKEN_KEY]: 'DEFAULT_TOKEN_KEY'
};
const config = existsSync(configPath) ? JSON.parse(readFileSync(configPath).toString()) : {};

export default {
  defaultConfig,
  ...config
};
