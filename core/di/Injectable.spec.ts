const injectable = jest.fn();

jest.mock("inversify", () => ({
  injectable: () => injectable
}));

import { Injectable } from "./Injectable";
import { getProperty } from "./utils";

describe("Injectable", () => {
  it("should create injectable", () => {
    @Injectable()
    class TestCls {}

    expect(injectable).toBeCalled();
  });

  it("should set metadata property", () => {
    @Injectable({
      singleton: true
    })
    class TestCls {}

    const injectableMetadata = getProperty(TestCls, "injectableMetadata");
    expect(injectableMetadata).toBeDefined();
  });
});
