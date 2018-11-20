import { Injectable } from "./Injectable";
import { Module } from "./Module";

describe("Core Dependency Injection Module", () => {
  // Fixtures
  @Injectable()
  class ClsA {
    methodA() {

    }
  }

  @Injectable()
  class ClsB {
    methodB() {

    }
  }

  @Injectable()
  class ClsC {
  }

  // Tests
  it('should create an empty module module', () => {
    const mod = Module(null);
    expect(mod).toBeDefined();
    expect(mod['metadata']).toBeNull();
  });

  it('should create a module with an import', () => {
    const modA = Module({
      imports: [ClsA, ClsB]
    });
    expect(modA).toBeDefined();

    const instanceA = modA.create(ClsA);
    expect(instanceA).toBeDefined();
    expect(instanceA.methodA).toBeDefined();

    const instanceB = modA.create(ClsB);
    expect(instanceB.methodB).toBeDefined();
  });

  it('should create a module that imports another module', () => {
    const modA = Module({
      imports: [ClsA, ClsC],
      exports: [ClsA]
    });

    const modB = Module({
      imports: [
        modA,
        ClsB
      ]
    });

    expect(modA.create(ClsA)).toBeDefined();
    expect(modA.create(ClsC)).toBeDefined();

    expect(modB.create(ClsB)).toBeDefined();
    expect(modB.create(ClsA)).toBeDefined();

    try { modA.create(ClsB); } catch (e) { expect(e).toBeDefined(); }
    try { modB.create(ClsC); } catch (e) { expect(e).toBeDefined(); }
  });
});