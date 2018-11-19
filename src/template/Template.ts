import { TemplateLoader } from "./TemplateLoader";
import { TemplateRenderer } from "./TemplateRenderer";

export class Template {
  get path(): string {
    return this.path;
  }

  get model(): Object {
    return this.model;
  }

  constructor(private templatePath: string, private templateModel: Object) {}

  async load(): Promise<string> {
    const loader = new TemplateLoader(this);
    return loader.load();
  }

  async render() {
    const renderer = new TemplateRenderer(this);
    return renderer.render();
  }
}
