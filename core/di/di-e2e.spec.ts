import { Injectable, Injector, Module } from ".";
import { getProperty, setProperty } from "./utils";

describe("core/di e2e tests", () => {
  // Fixtures
  @Injectable()
  class ClsA {
    public methodA() {
      return "methodA";
    }
  }

  @Injectable()
  class ClsB {
    public methodB() {
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
      providers: [ClsA, ClsB]
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
      providers: [ClsA, ClsC],
      exports: [ClsA]
    })
    class ModA {}

    @Module({
      providers: [ModA, ClsB]
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

  it("should create singleton", () => {
    @Injectable({
      singleton: true
    })
    class Singleton {}

    @Injectable()
    class NonSingleton {}

    @Module({
      providers: [Singleton, NonSingleton]
    })
    class TestModule {}

    const singletonInstance1 = Injector(TestModule).create(Singleton);
    const singletonInstance2 = Injector(TestModule).create(Singleton);
    expect(singletonInstance1).toBe(singletonInstance2);

    const nonSingletonInstance1 = Injector(TestModule).create(NonSingleton);
    const nonSingletonInstance2 = Injector(TestModule).create(NonSingleton);
    expect(nonSingletonInstance1).not.toBe(nonSingletonInstance2);
  });

  it("should import dependency with factory", () => {
    const factory = jest.fn();

    @Injectable()
    class Dep2 {}

    @Injectable()
    class Dep {}

    @Module({
      providers: [{ factory, dependency: Dep }]
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
      providers: [{ cls: Dep2, dependency: Dep }]
    })
    class TestModule {}

    const instance = Injector(TestModule).create(Dep);
    expect(instance instanceof Dep2).toBe(true);
  });
});
