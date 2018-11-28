import { getProperty, setProperty } from "./utils";

describe("utils", () => {
  it("should set a property in a function", () => {
    const fixture = () => ({});
    const testValue = "value";
    const testKey = "myprop";
    setProperty(fixture, testKey, testValue);
    const prop = getProperty(fixture, testKey);
    expect(prop).toBe(testValue);
  });

  it("should set a property in an object", () => {
    const fixture = {};
    const testValue = "value";
    const testKey = "myprop";
    setProperty(fixture, testKey, testValue);
    const prop = getProperty(fixture, testKey);
    expect(prop).toBe(testValue);
  });
});