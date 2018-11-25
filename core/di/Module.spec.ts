import { Mod, Module } from "./Module";

describe("Core Dependency Injection Module", () => {
  // Fixtures
  class ClsA {
    methodA() {
      return "methodA";
    }
  }

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
});
