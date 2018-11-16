import { FileUtils } from "../utils/FileUtils";
import { ConfigKey } from "./ConfigKeys";
import {
  DEFAULT_CONFIG,
  DEFAULT_CONFIG_PATH,
  DEFAULT_CONFIG_FILE
} from "./Defaults";


export class Config {
  private static instance: Config;

  static async get<T = string>(key: ConfigKey) {
    const config = Config.getInstance();
    const configPath = config.getPath();
    const keyValues = await config.load(configPath);
    return keyValues.get(key.toString());
  }

  private static getInstance(): Config {
    if (Config.instance == null) {
      Config.instance = new Config();
    }

    return Config.instance;
  }

  private async load(path: string) {
    const exists = await FileUtils.exists(path);
    
    if (!exists) {
      console.warn(`File ${path} not found. Using the default configurations.`);
      return DEFAULT_CONFIG;
    }

    const content = await FileUtils.readFile(path);
    
    try {
      const parsedContent = JSON.parse(content);
      const keys = Object.keys(parsedContent);
      const keyValues = keys.map(k => [k, parsedContent[k]]) as any as ReadonlyArray<[string, string]>;
      return new Map<string, string>(keyValues);
    } catch(e) {
      console.warn(`Unable to parse the configuration file at path ${path}. Using the default configurations.`);
      return DEFAULT_CONFIG;
    }
  }

  private getPath(): string {
    const configPath = process.env['config'] || DEFAULT_CONFIG_PATH;
    return `${configPath}/${DEFAULT_CONFIG_FILE}`;
  }
}