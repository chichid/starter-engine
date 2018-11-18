import { Template } from './Template';
import { FileUtils } from '../utils/FileUtils';
import { Config  } from '../config/index';
import { resolve } from 'path';

export class TemplateLoader {
  constructor(private template: Template) {}

  async load(): Promise<string> {
    // TODO implement
    // const path = await this.resolveTemplatePath();
    // const content = await FileUtils.readFile(path);
    // return content;
    return '';
  }

  private async resolveTemplatePath() {
    // TODO implement
    // const baseFolder = Config.getConfig().getBasePath();
    // const path = resolve(baseFolder, this.template.path);
    // return path;
  }
}