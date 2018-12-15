import { Module } from "./Module";
import { ModuleResolver } from "./ModuleResolver";
import { getProperty, setProperty } from "./utils";

describe("Core Dependency Injection Module", () => {
  // Fixtures
  class ClsA {
    public methodA() {
      return "methodA";
    }
  }

  it("create a module", () => {
    const mod = new ModuleResolver({
      providers: [ClsA],
      exports: []
    });
    expect(mod).toBeDefined();

    const emptyMod = new ModuleResolver(null);
    expect(emptyMod).toBeDefined();
  });

  it("should get exports", () => {
    const testMod = new ModuleResolver({
      exports: [ClsA]
    });

    expect(testMod.exports).toEqual([ClsA]);
  });

  it("should create a module dependency", () => {
    @Module()
    class TestModule {}

    const testMod = getProperty(TestModule, "module");
    expect(() => testMod.create(ClsA)).toThrow();

    testMod.importDependency(ClsA);
    testMod.container.get = jest.fn();
    testMod.create(ClsA);
    expect(testMod.container.get).toBeCalledWith(ClsA);
  });

  it("should throw exception when unable to import dependencies", () => {
    const testMod = new ModuleResolver({
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

    const testMod = new ModuleResolver({
      providers: [TestParentMod]
    });

    const tm = testMod as any;
    tm.importModuleExports(new TestParentMod());
    expect(tm.importedTypes.get(ClsA.name)).toBeDefined();
  });

  it("should import a class", () => {
    @Module()
    class TestModule {}

    const testMod = getProperty(TestModule, "module");
    testMod.importClass = jest.fn();

    testMod.importDependency(ClsA);
    expect(testMod.importClass).toBeCalledWith(ClsA.name, ClsA);
  });

  it("should import a factory", () => {
    @Module()
    class TestModule {}

    const testMod = getProperty(TestModule, "module");
    testMod.importClass = jest.fn();

    const factory = jest.fn();
    testMod.importDependency({ factory, dependency: ClsA });

    expect(testMod.importClass).toBeCalledWith(ClsA.name, ClsA, factory);
  });

  it("should import and map a class", () => {
    @Module()
    class TestModule {}

    class TestCls {}

    const testMod = getProperty(TestModule, "module");

    testMod.importClass = jest.fn();
    testMod.importDependency({ dependency: ClsA, cls: TestCls });

    expect(testMod.importClass).toBeCalledWith(ClsA.name, ClsA, TestCls, true);
  });

  it("should importClass", () => {
    @Module()
    class TestModule {}

    const testMod = getProperty(TestModule, "module");

    // Create stubs
    let to;
    let toFactory;
    let toSelf;

    const resetBindingFixture = () => {
      to = jest.fn();
      toFactory = jest.fn();
      toSelf = jest.fn();
      testMod.container.bind = jest.fn(() => ({
        to,
        toFactory,
        toSelf
      }));
    };

    // Test normal class import
    resetBindingFixture();
    testMod.importClass(ClsA.name, ClsA);
    expect(testMod.container.bind).toBeCalledWith(ClsA);
    expect(toSelf).toBeCalled();
    expect(to).not.toBeCalled();
    expect(toFactory).not.toBeCalled();

    // Test import with a factory function
    resetBindingFixture();
    const factory = jest.fn();
    testMod.importClass(ClsA.name, ClsA, factory);
    expect(testMod.container.bind).toBeCalledWith(ClsA);
    expect(toSelf).not.toBeCalled();
    expect(to).not.toBeCalled();
    expect(toFactory).toBeCalledWith(factory);

    // Test import with class mapping
    resetBindingFixture();
    class ClsB {}
    testMod.importClass(ClsA.name, ClsA, ClsB, true);
    expect(testMod.container.bind).toBeCalledWith(ClsA);
    expect(toSelf).not.toBeCalled();
    expect(to).toBeCalledWith(ClsB);
    expect(toFactory).not.toBeCalled();
  });

  it("should apply import metadata", () => {
    class TestCls {}

    @Module()
    class TestModule {}

    const testMod = getProperty(TestModule, "module");

    let binding;
    let inSingletonScope;
    const resetBindingFixture = () => {
      inSingletonScope = jest.fn();
      binding = { inSingletonScope };
    };

    // Test with no metadata
    resetBindingFixture();
    expect(testMod.applyImportMetadata(TestCls, binding)).toEqual(binding);

    // Test with empty injectable metadata
    resetBindingFixture();
    setProperty(TestCls, "injectableMetadata", {});
    expect(testMod.applyImportMetadata(TestCls, binding)).toEqual(binding);

    // Test Singleton property
    resetBindingFixture();
    setProperty(TestCls, "injectableMetadata", { singleton: false });
    testMod.applyImportMetadata(TestCls, binding);
    expect(inSingletonScope).not.toBeCalled();

    setProperty(TestCls, "injectableMetadata", { singleton: true });
    testMod.applyImportMetadata(TestCls, binding);
    expect(inSingletonScope).toBeCalled();
  });

  it("should throw exception when trying to import a dependency using the complex syntax with no factory or cls attribute", () => {
    @Module()
    class TestModule {}

    const testMod = getProperty(TestModule, "module");
    expect(() => testMod.importDependency({ dependency: ClsA })).toThrow();
  });

  // TODO
  // Test import dependency when not in the module
});
