import { Template } from './Template';
import { FileUtils } from '../utils/FileUtils';
import { Config  } from '../config';
import { resolve } from 'path';

export class TemplateLoader {
  constructor(private template: Template) {}

  async load(): Promise<string> {
    const path = await this.resolveTemplatePath();
    const content = await FileUtils.readFile(path);
    return content;
  }

  private async resolveTemplatePath() {
    const basePath = Config.getConfig().getConfigFilePath();
    const baseFolder = await Config.get(basePath);
    const path = resolve(baseFolder, this.template.path);
    return path;
  }
}