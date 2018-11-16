import { FileUtils } from '../utils/FileUtils';
import { ConfigKey } from './ConfigKeys';
import {
  DEFAULT_CONFIG,
  DEFAULT_CONFIG_PATH,
  DEFAULT_CONFIG_FILE,
} from './Defaults';

export class Config {
  private static instance: Config;
  private cache: KeyValue;

  static async get<T = string>(key: ConfigKey) {
    return Config.getConfig().get(key);
  }

  public static getConfig(): Config {
    // TODO when injection is available get rid of the singleton

    if (Config.instance == null) {
      Config.instance = new Config();
    }

    return Config.instance;
  }

  public async get<T>(key: ConfigKey) {
    const config = Config.getConfig();
    const configPath = config.getConfigFilePath();

    if (!this.cache) {
      this.cache = await config.load(configPath);
    }

    return this.cache.get(key.toString());
  }

  public getBasePath(): string {
    return process.env['config'] || DEFAULT_CONFIG_PATH;
  }

  public getConfigFilePath(): string {
    return `${this.getBasePath()}/${DEFAULT_CONFIG_FILE}`;
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
      const keyValues = keys.map(k => [k, parsedContent[k]]) as any;
      return new Map<string, string>(keyValues as ReadonlyArray<[string, string]>);
    } catch (e) {
      console.warn(
        `Unable to parse the configuration file at path ${path}.` +
        'Using the default configurations.',
      );
      return DEFAULT_CONFIG;
    }
  }
}