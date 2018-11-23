import { Injectable } from "./Injectable";
import { Inject } from "./Inject";
import { Module, Injector } from "./Module";

describe("Inject", () => {
  @Injectable()
  class ClsA {
    methodA(): string {
      return "Hello World!";
    }
  }

  @Injectable()
  class ClsB {
    @Inject private clsA: ClsA;

    methodB(): string {
      return this.clsA.methodA();
    }
  }

  @Module({
    imports: [ClsA, ClsB]
  })
  class TestMod {}

  it("should use injectable", () => {
    const instance: ClsA = Injector(TestMod).create(ClsA);
    expect(instance.methodA()).toBe("Hello World!");
  });
});
