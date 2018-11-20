import { Injectable } from "./Injectable";
import { Inject } from "./Inject";
import { Module } from "./Module";

describe("Inject", () => {
  @Injectable()
  class ClsA {
    methodA(): string {
      return 'Hello World!';
    }
  }

  @Injectable()
  class ClsB {
    @Inject private clsA: ClsA;

    methodB(): string {
      return this.clsA.methodA();
    }
  }

  const mod = Module({
    imports: [ClsA, ClsB]
  });


  it('should use injectable', () => {
    const instance: ClsA = mod.create(ClsA);
    expect(instance.methodA()).toBe('Hello World!');
  });
});