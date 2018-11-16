const DEFAULT_CONFIG_FILE = '.staengrc';

export enum ConfigKeys {
  BASE_FOLDER,
}

export class Config {
  static async get<T = string>(key: ConfigKeys) {
    const config = new Config();
    const configPath = config.getPath();
    await config.load(configPath);
    return (config as any) as T;
  }

  async load(path: string) {
    // TODO implement
    // TODO caching
  }

  private getPath(): string {
    const configPath = process.env['config'] || DEFAULT_CONFIG_FILE;
    return configPath;
  }
}