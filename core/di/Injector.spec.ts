import { Injectable } from "./Injectable";
import { Injector } from "./Injector";
import { Module } from "./Module";

describe("Injector", () => {
  @Injectable()
  class Cls {}

  @Module({
    providers: [Cls]
  })
  class TestModule {}

  @Injectable()
  class Cls2 {}

  class TestModule2 {}

  it("should create a module with the Injector", () => {
    const instance = Injector(TestModule).create(Cls);
    expect(instance).toBeDefined();
  });

  it("should throw excepton when class is not part of the module", () => {
    let exception;

    try {
      Injector(TestModule2).create(Cls2);
    } catch (e) {
      exception = e;
    }

    expect(exception).toBeDefined();
  });
});
