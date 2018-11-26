import { Mod, Module } from "./Module";
import { getProperty } from "./utils";

describe("Core Dependency Injection Module", () => {
  // Fixtures
  class ClsA {
    methodA() {
      return "methodA";
    }
  }

  it("create a module", () => {
    const mod = new Mod({
      imports: [ClsA],
      exports: []
    });
    expect(mod).toBeDefined();

    const emptyMod = new Mod(null);
    expect(emptyMod).toBeDefined();
  });

  it("should get exports", () => {
    const testMod = new Mod({
      exports: [ClsA]
    });

    expect(testMod.exports).toEqual([ClsA]);
  });

  it("should throw exception when unable to import dependencies", () => {
    const testMod = new Mod({
      exports: [ClsA]
    });

    const t = () => {
      (testMod as any).importDependency({});
    };

    expect(t).toThrow();
  });

  it("should import module exports", () => {
    @Module({
      exports: [ClsA]
    })
    class TestParentMod { }

    const testMod = new Mod({
      imports: [TestParentMod]
    });

    const tm = testMod as any;
    tm.importModuleExports(new TestParentMod());
    expect(tm.importedTypes.get(ClsA.name)).toBeDefined();
  });

  it("should import a class", () => {
    @Module()
    class TestModule { };

    const testMod = getProperty(TestModule, "module");
    testMod.importClass = jest.fn();

    testMod.importDependency(ClsA);
    expect(testMod.importClass).toBeCalledWith(ClsA.name, ClsA);
  });

  it("should throw exception when trying to import a dependency using the complex syntax with no factory or cls attribute", () => {
    @Module()
    class TestModule { };

    const testMod = getProperty(TestModule, "module");
    expect(() => testMod.importDependency({ dependency: ClsA })).toThrow();
  });
});
