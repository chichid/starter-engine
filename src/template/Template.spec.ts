import { Template } from "./Template";

describe("Template", () => {
  it("should create a template", () => {
    const testContent = "some content {{data1}} {{data2.data21}}";
    const testModel = {}
    const template = new Template(testContent, testModel);
    expect(template).toBeDefined();
    expect(template.content).toEqual(testContent);
    expect(template.model).toEqual(testModel);
  });

  it("should compile a template", () => {
    const testContent = "some content {{data1}} {{data2.data21}}";
    const testModel = {}
    const template = new Template(testContent, testModel) as any;
    template.compileTemplate();
    expect(template.compiledTemplate).toBeDefined();
  });

  it("should render the template", () => {
    const testContent = "some content {{data1}} {{data2.data21}}";
    const testModel = {
      "data1": "some string",
      "data2": {
        "data21": "deep string"
      }
    };

    const template = new Template(testContent, testModel);
    const result = template.render();
    expect(result).toEqual("some content some string deep string");

    // Ensure caching of the compiled template is working
    const compileTemplateFn = jest.fn();
    (template as any).compileTemplate = compileTemplateFn;
    template.render();
    expect(compileTemplateFn).not.toBeCalled();
  });
});