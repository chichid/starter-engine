import { TemplateLoader } from "./TemplateLoader";
import { Module, Injectable, Inject, Injector } from "@core/di";
import { UtilsModule, FileUtils } from "../utils";

describe("TemplateLoader", () => {
  const TEST_PATH = "/some/path" + "test";
  const TEST_CONTENT = "some content template {{content}}";


  @Injectable()
  class MockFileUtils {
    async readFile() {
      return TEST_CONTENT;
    }
  }

  @Module({
    imports: [
      { dependency: FileUtils, cls: MockFileUtils },
      TemplateLoader
    ]
  })
  class TestingModule { }

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
});