import { Inject, Injectable, Injector, Module } from "@core/di";
import { FileUtils } from "../utils";
import { TemplateLoader } from "./TemplateLoader";

describe("TemplateLoader", () => {
  const TEST_PATH = "/some/path/test/template.hbs";
  const TEST_CONTENT = "some content template {{content}}";
  const TEST_MODEL = "export function root() {}";

  it("should create a loader", () => {
    const loader = Injector(TestingModule).create(TemplateLoader);
    expect(loader).toBeDefined();
  });

  it("should load a template", async () => {
    const loader = Injector(TestingModule).create(TemplateLoader);
    const template = await loader.loadTemplate(TEST_PATH);
    expect(template).toBeDefined();
    expect(template.content).toEqual(TEST_CONTENT);
  });

  it("should get a model file", () => {
    const loader = Injector(TestingModule).create(TemplateLoader);
    const modelFile = (loader as any).getModelFile("/some/template/path.hbs");
    expect(modelFile).toEqual("/some/template/path.model.ts");
  });

  it("should load a model file", async () => {
    const loader = Injector(TestingModule).create(TemplateLoader);
    let model = await loader.loadModel("/non/existent/model");
    expect(model).toBeNull();

    model = await loader.loadModel(TEST_PATH);
    expect(model).toBeDefined();
  });

  // Stubs
  @Injectable()
  class MockFileUtils extends FileUtils {
    public async readFile(path: string) {
      if (path && path.indexOf(".model") !== -1) {
        return TEST_MODEL;
      }

      return TEST_CONTENT;
    }

    public async exists(path: string) {
      return path === TEST_PATH;
    }
  }

  // tslint:disable-next-line:max-classes-per-file
  @Module({
    imports: [
      { dependency: FileUtils, cls: MockFileUtils },
      TemplateLoader
    ]
  })
  class TestingModule { }
});