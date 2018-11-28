import { Template } from "./Template";

export class TemplateLoader {
  constructor(private path: Template) { }

  async load(): Promise<Template> {
    return null;
  }
}
