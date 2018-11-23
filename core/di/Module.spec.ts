import { Injectable } from "./Injectable";
import { Module, Injector } from "./Module";

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
});
