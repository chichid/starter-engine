import { Inject } from "./Inject";

// Fixtures
class ClsA {
  methodA = jest.fn();
}

class ClsB {
  private clsA: ClsA;

  methodB() {
    this.clsA.methodA();
  }
}

// Stubs
jest.mock("inversify", () => ({
  inject: () => (target, key) => {
    target[key] = new ClsA();
  }
}));

// Test
describe("Inject", () => {
  it("should inject a property", () => {
    let instance = new ClsB();
    Inject(instance, "clsA");
    expect((instance as any).clsA).toBeDefined();
  });

  it("should call methods within injected property", () => {
    let instance = new ClsB();
    Inject(instance, "clsA");
    instance.methodB();
    expect((instance as any).clsA.methodA).toBeCalled();
  });
});