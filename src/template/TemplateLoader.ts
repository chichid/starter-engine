import { Inject, Injectable } from "@core/di";
import { FileUtils } from "../utils";
import { Template } from "./Template";

const MODEL_FILE_EXT = "model.ts";

@Injectable()
export class TemplateLoader {
  @Inject
  private fileUtils: FileUtils;

  public async loadTemplate(path: string): Promise<Template> {
    const templateContent = await this.fileUtils.readFile(path);
    const template = new Template(templateContent, null);
    return template;
  }

  public async loadModel(templatePath: string) {
    const modelFile = this.getModelFile(templatePath);
    const fileExists = await this.fileUtils.exists(modelFile);

    if (fileExists) {
      return await import(modelFile);
    }

    return null;
  }

  private getModelFile(templatePath: string) {
    const ext = this.fileUtils.ext(templatePath);
    const fileWithNoExt = templatePath.replace(ext, "");
    return `${fileWithNoExt}.${MODEL_FILE_EXT}`;
  }
}
