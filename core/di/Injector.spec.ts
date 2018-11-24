import { Module } from "./Module";
import { Injectable } from "./Injectable";
import { Injector } from "./Injector";

describe("Injector", () => {
  @Injectable()
  class Cls { }

  @Module({
    imports: [Cls]
  })
  class TestModule { }

  it('should create a module with the Injector', () => {
    const instance = Injector(TestModule).create(Cls);
    expect(instance).toBeDefined();
  });
});