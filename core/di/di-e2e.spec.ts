import { Inject, Injectable, Injector, Module } from ".";

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
    class TestModule {}

    const mod = new TestModule();
    expect(mod).toBeDefined();
  });

  it("should throw exception when importing a non existing dependency ", () => {
    @Module({})
    class TestModule {}
    expect(() => Injector(TestModule).create(ClsA)).toThrow(
      `ClsA is not declared in module TestModule`
    );
  });

  it("should provide injectable classes", () => {
    @Module({
      providers: [ClsA, ClsB]
    })
    class TestModule {}

    const instanceA = Injector(TestModule).create(ClsA);
    expect(instanceA).toBeDefined();
    expect(instanceA.methodA).toBeDefined();
    expect(instanceA.methodA()).toEqual("methodA");

    const instanceB = Injector(TestModule).create(ClsB);
    expect(instanceB.methodB).toBeDefined();
    expect(instanceB.methodB()).toEqual(true);
  });

  it("should import a module", () => {
    @Module({
      providers: [ClsA, ClsC],
      exports: [ClsA]
    })
    class TestModule {}

    @Module({
      imports: [TestModule],
      providers: [ClsB]
    })
    class AnotherTestModule {}

    expect(Injector(TestModule).create(ClsA)).toBeDefined();
    expect(Injector(TestModule).create(ClsC)).toBeDefined();

    expect(Injector(AnotherTestModule).create(ClsB)).toBeDefined();
    expect(Injector(TestModule).create(ClsA)).toBeDefined();

    try {
      Injector(TestModule).create(ClsB);
    } catch (e) {
      expect(e).toBeDefined();
    }

    try {
      Injector(AnotherTestModule).create(ClsC);
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

  it("should provide dependency with factory", () => {
    const factory = jest.fn();

    @Module({
      providers: [{ factory, dependency: ClsA }]
    })
    class TestModule {}

    Injector(TestModule).create(ClsA);
    expect(factory).toBeCalled();
  });

  it("should provide dependency with class mapping", () => {
    @Module({
      providers: [{ dependency: ClsA, cls: ClsB }]
    })
    class TestModule {}

    const instance = Injector(TestModule).create(ClsA);
    expect(instance).toBeInstanceOf(ClsB);
  });

  it("should should import a module, provide classes & export classes", () => {
    @Module({
      providers: [ClsA]
    })
    class TestParentModule {}

    @Module({
      imports: [TestParentModule],
      providers: [ClsB],
      exports: [ClsB]
    })
    class TestModule {}

    expect(Injector(TestModule).create(ClsA)).toBeInstanceOf(ClsA);
    expect(Injector(TestModule).create(ClsB)).toBeInstanceOf(ClsB);
  });

  // TODO test ancestor imports

  it("should should import a module, provide classes & export classes", () => {
    @Module({
      providers: [ClsC]
    })
    class TestAncestorModule {}

    @Module({
      imports: [TestAncestorModule],
      providers: [ClsA]
    })
    class TestParentModule {}

    @Module({
      imports: [TestParentModule],
      providers: [ClsB],
      exports: [ClsB]
    })
    class TestModule {}

    expect(Injector(TestModule).create(ClsA)).toBeInstanceOf(ClsA);
    expect(Injector(TestModule).create(ClsB)).toBeInstanceOf(ClsB);
    expect(Injector(TestModule).create(ClsC)).toBeInstanceOf(ClsC);
  });

  it("should inject properties", () => {
    @Injectable()
    class TestClass {
      @Inject
      public clsA: ClsA;
    }

    @Module({
      providers: [ClsA, TestClass]
    })
    class TestModule {}

    const testClass = Injector(TestModule).create(TestClass) as TestClass;
    expect(testClass.clsA).toBeInstanceOf(ClsA);
  });
});
