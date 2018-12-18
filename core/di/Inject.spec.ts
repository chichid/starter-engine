import { Inject } from "./Inject";

// Fixtures
class ClsA {
  public methodA = jest.fn();
}

class ClsB {
  private clsA: ClsA;

  public methodB() {
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
    const instance = new ClsB();
    Inject(instance, "clsA");
    expect((instance as any).clsA).toBeDefined();
  });

  it("should call methods within injected property", () => {
    const instance = new ClsB();
    Inject(instance, "clsA");
    instance.methodB();
    expect((instance as any).clsA.methodA).toBeCalled();
  });
});
