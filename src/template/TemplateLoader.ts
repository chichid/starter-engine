import { Inject, Injectable } from "@core/di";
import { Template } from "./Template";
import { FileUtils } from "../utils";

@Injectable()
export class TemplateLoader {
  @Inject
  private fileUtils: FileUtils;

  async loadTemplate(path: string): Promise<Template> {
    const templateContent = await this.fileUtils.readFile(path);
    const template = new Template(templateContent, null);
    return template;
  }
}
