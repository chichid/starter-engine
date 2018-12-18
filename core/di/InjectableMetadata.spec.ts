import { InjectableMetadata } from "./InjectableMetadata";

describe("Injectable metadata", () => {
  it("should createinjectable metadata", () => {
    const fixture = new InjectableMetadata();
    fixture.singleton = true;
    expect(fixture).toBeDefined();
  });
});
