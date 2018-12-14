import { ModuleImport } from "./ModuleImport";

describe("ModuleImport", () => {
  it("should create a module import", () => {
    const fixture = new ModuleImport();
    fixture.dependency = {};
    fixture.factory = jest.fn();
    expect(fixture).toBeDefined();
  });
});
