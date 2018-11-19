import { Injectable, Inject } from "@core/di";
import { ConfigKey } from "./ConfigKeys";
import { FileUtils } from "../utils";
import { KeyValue } from "./types";
import {
  DEFAULT_CONFIG,
  DEFAULT_CONFIG_PATH,
  DEFAULT_CONFIG_FILE
} from "./Defaults";

@Injectable()
export class Config {
  private cache: KeyValue;
  @Inject private fileUtils: FileUtils;

  public async get<T>(key: ConfigKey) {
    const configPath = this.getConfigFilePath();

    if (!this.cache) {
      this.cache = await this.load(configPath);
    }

    return this.cache.get(key.toString());
  }

  public getBasePath(): string {
    return process.env["config"] || DEFAULT_CONFIG_PATH;
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
      return new Map<string, string>(keyValues as ReadonlyArray<
        [string, string]
      >);
    } catch (e) {
      console.warn(
        `Unable to parse the configuration file at path ${path}.` +
          "Using the default configurations."
      );
      return DEFAULT_CONFIG;
    }
  }
}
