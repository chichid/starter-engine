import { Injectable } from "./Injectable";
import { Module, Mod } from "./Module";
import { Injector } from "./Injector";
import { getProperty, setProperty } from "./utils";

describe("Core Dependency Injection Module", () => {
  // Fixtures
  @Injectable()
  class ClsA {
    methodA() {
      return "methodA";
    }
  }

  @Injectable()
  class ClsB {
    methodB() {
      return true;
    }
  }

  @Injectable()
  class ClsC {}

  // Tests
  it("should create an empty module module", () => {
    @Module({})
    class ModA {}

    const mod = new ModA();
    expect(mod).toBeDefined();
  });

  it("should create a module with an import", () => {
    @Module({
      imports: [ClsA, ClsB]
    })
    class ModA {}
    const modA = new ModA();
    expect(modA).toBeDefined();

    const instanceA = Injector(ModA).create(ClsA);
    expect(instanceA).toBeDefined();
    expect(instanceA.methodA).toBeDefined();
    expect(instanceA.methodA()).toEqual("methodA");

    const instanceB = Injector(ModA).create(ClsB);
    expect(instanceB.methodB).toBeDefined();
    expect(instanceB.methodB()).toEqual(true);
  });

  it("should create a module that imports another module", () => {
    @Module({
      imports: [ClsA, ClsC],
      exports: [ClsA]
    })
    class ModA {}

    @Module({
      imports: [ModA, ClsB]
    })
    class ModB {}

    expect(Injector(ModA).create(ClsA)).toBeDefined();
    expect(Injector(ModA).create(ClsC)).toBeDefined();

    expect(Injector(ModB).create(ClsB)).toBeDefined();
    expect(Injector(ModA).create(ClsA)).toBeDefined();

    try {
      Injector(ModA).create(ClsB);
    } catch (e) {
      expect(e).toBeDefined();
    }

    try {
      Injector(ModB).create(ClsC);
    } catch (e) {
      expect(e).toBeDefined();
    }
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
    class TestParentMod {}

    const testMod = new Mod({
      imports: [TestParentMod]
    });

    const tm = testMod as any;
    tm.importModuleExports(new TestParentMod());
    expect(tm.importedTypes.get(ClsA.name)).toBeDefined();
  });

  it("should create singleton", () => {
    @Injectable({
      singleton: true
    })
    class Singleton {}

    @Injectable()
    class NonSingleton {}

    @Module({
      imports: [Singleton, NonSingleton]
    })
    class TestModule {}

    const singletonInstance1 = Injector(TestModule).create(Singleton);
    const singletonInstance2 = Injector(TestModule).create(Singleton);
    expect(singletonInstance1).toBe(singletonInstance2);

    const nonSingletonInstance1 = Injector(TestModule).create(NonSingleton);
    const nonSingletonInstance2 = Injector(TestModule).create(NonSingleton);
    expect(nonSingletonInstance1).not.toBe(nonSingletonInstance2);
  });

  it("should import dependencies when metadata is empty", () => {
    @Injectable()
    class Dep {}

    @Module()
    class TestModule {}

    setProperty(Dep, "injectableMetadata", null);
    const tMod = getProperty(TestModule, "module");
    tMod.importDependency(Dep);
    expect(tMod.importedTypes.get(Dep.name)).toBeDefined();
  });

  it("should import dependency with factory", () => {
    const factory = jest.fn();

    @Injectable()
    class Dep2 {}

    @Injectable()
    class Dep {}

    @Module({
      imports: [{ factory, dependency: Dep }]
    })
    class TestModule {}

    Injector(TestModule).create(Dep);
    expect(factory).toBeCalled();
  });

  it("should import dependency with class mapping", () => {
    @Injectable()
    class Dep2 {}

    @Injectable()
    class Dep {}

    @Module({
      imports: [{ cls: Dep2, dependency: Dep }]
    })
    class TestModule {}

    const instance = Injector(TestModule).create(Dep);
    expect(instance instanceof Dep2).toBe(true);
  });
});
