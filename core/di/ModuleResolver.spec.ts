import { MetaKey } from "./Constants";
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
  setProperty(ClsA, "injectableMetadata", {});

  it("create a module", () => {
    const mod = new ModuleResolver({
      providers: [ClsA]
    });

    const emptyMod = new ModuleResolver();

    expect(mod).toBeDefined();
    expect(emptyMod).toBeDefined();
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

  it("should import module", () => {
    @Module({
      providers: [ClsA]
    })
    class TestParentMod {}

    const testMod = new ModuleResolver({
      imports: [TestParentMod]
    });

    const tm = testMod as any;
    tm.importModule(new TestParentMod());

    expect(tm.importedTypes.get(ClsA.name)).toBeDefined();
    expect(tm.container.isBound(ClsA)).toBeTruthy();
  });

  it("should throw when missing the module decorator", () => {
    class TestParentMod {}

    expect(
      () =>
        new ModuleResolver({
          imports: [TestParentMod]
        })
    ).toThrow();
  });

  it("should import a class", () => {
    @Module()
    class TestModule {}

    const testMod = getProperty(TestModule, MetaKey.MODULE_RESOLVER);
    testMod.importClass = jest.fn();

    testMod.importDependency(ClsA);
    expect(testMod.importClass).toBeCalledWith(ClsA.name, ClsA);
  });

  it("should throw when unable to import a class", () => {
    @Module()
    class TestModule {}

    const testMod = getProperty(TestModule, MetaKey.MODULE_RESOLVER);
    expect(() => testMod.importDependency({})).toThrow(
      `Unable to import [object Object] within TestModule`
    );
  });

  it("should import a factory", () => {
    @Module()
    class TestModule {}

    const testMod = getProperty(TestModule, MetaKey.MODULE_RESOLVER);
    testMod.importClass = jest.fn();

    const factory = jest.fn();
    testMod.importDependency({ factory, dependency: ClsA });

    expect(testMod.importClass).toBeCalledWith(ClsA.name, ClsA, factory);
  });

  it("should throw when importing a class and no metadata is available", () => {
    @Module()
    class TestModule {}

    const testMod = getProperty(TestModule, MetaKey.MODULE_RESOLVER);
    testMod.metadata = null;
    expect(() => testMod.importClass("TestProvider", {})).toThrow(
      `Unable to import provider TestProvider, maybe it's missing a @Injectable decorator or it's missing from the providers declaration`
    );
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
