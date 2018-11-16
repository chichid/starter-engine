import { Template } from './Template';

export class TemplateRenderer {
  constructor(private template: Template) { }

  async render() {
    const content = await this.template.load();
    return this.compileHandlebars(content);
  }

  private compileHandlebars(content: string) {
    const compiled = Handlebars.compile(content);
    const result = compiled(content);
    return result;
  }
}