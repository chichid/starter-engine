import * as HandleBars from "handlebars";

export class Template {
  private compiledTemplate: any = null;

  get content(): string {
    return this.templateContent;
  }

  get model(): object {
    return this.templateModel;
  }

  constructor(
    private templateContent: string,
    private templateModel: object
  ) { }

  public render(): string {
    if (!this.compiledTemplate) {
      this.compileTemplate();
    }

    return this.compiledTemplate(this.model);
  }

  private compileTemplate() {
    this.compiledTemplate = HandleBars.compile(this.templateContent);
  }
}
