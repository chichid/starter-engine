import { Template } from './Template';
import { FileUtils } from '../utils/FileUtils';
import { Config, ConfigKeys } from '../config/Config';
import { resolve } from 'path';

export class TemplateLoader {
  constructor(private template: Template) {}

  async load(): Promise<string> {
    const path = await this.resolveTemplatePath();
    const content = await FileUtils.readFile(path);
    return content;
  }

  private async resolveTemplatePath() {
    const baseFolder = await Config.get(ConfigKeys.BASE_FOLDER);
    const path = resolve(baseFolder, this.template.path);
    return path;
  }
}