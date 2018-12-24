import { Inject, Injectable } from "@core/di";
import { FileUtils } from "../utils";
import { ConfigKey } from "./ConfigKeys";
import {
  DEFAULT_CONFIG,
  DEFAULT_CONFIG_FILE,
  DEFAULT_CONFIG_PATH
} from "./Defaults";
import { KeyValue } from "./Types";

@Injectable()
export class Config {
  @Inject
  private fileUtils: FileUtils;

  private cache: KeyValue;

  public async get<T>(key: ConfigKey) {
    const configPath = this.getConfigFilePath();

    if (!this.cache) {
      this.cache = await this.load(configPath);
    }

    return this.cache.get(key.toString());
  }

  public getBasePath(): string {
    return process.env.config || DEFAULT_CONFIG_PATH;
  }

  public getConfigFilePath(): string {
    return `${this.getBasePath()}/${DEFAULT_CONFIG_FILE}`;
  }

  private async load(path: string) {
    const exists = await this.fileUtils.exists(path);

    if (!exists) {
      console.warn(`File ${path} not found. Using the default configurations.`);
      return DEFAULT_CONFIG;
    }

    const content = await this.fileUtils.readFile(path);

    try {
      const parsedContent = JSON.parse(content);
      const keys = Object.keys(parsedContent);
      const keyValues = keys.map(k => [k, parsedContent[k]]) as any;
      const kv = keyValues as ReadonlyArray<[string, string]>;
      return new Map<string, string>(kv);
    } catch (e) {
      console.warn(
        `Unable to parse the configuration file at path ${path}.` +
          "Using the default configurations."
      );
      return DEFAULT_CONFIG;
    }
  }
}
