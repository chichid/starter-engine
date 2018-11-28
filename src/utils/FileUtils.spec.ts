const MOCK_READ_FILE_CONTENT = "Test Content";
const MOCK_READ_FILE_ERROR = "Error Reading The File";
const readFile = jest.fn((path, callback) => {
  if (path === "/some/test/path.txt") {
    callback(null, MOCK_READ_FILE_CONTENT);
  } else {
    callback(MOCK_READ_FILE_ERROR);
  }
});

const exists = jest.fn((path, callback) => {
  if (path === "/some/existing/path.txt") {
    callback(true);
  } else {
    callback(false);
  }
});

jest.mock("fs", () => ({
  readFile,
  exists
}));

import { FileUtils } from "./FileUtils";

describe("FileUtils", () => {
  it("should read file", async () => {
    const fu = new FileUtils();
    const testPath = "/some/test/path.txt";
    const content = await fu.readFile(testPath);
    expect(content).toBe(MOCK_READ_FILE_CONTENT);
  });

  it("should throw when no file exists", async () => {
    const fu = new FileUtils();
    const testPath = "/wrong.txt";
    let error;
    try { await fu.readFile(testPath) } catch (e) { error = e };
    expect(error).toEqual(MOCK_READ_FILE_ERROR);
  });

  it("should check if file exists", async () => {
    const fu = new FileUtils();
    expect(await fu.exists("/some/existing/path.txt")).toEqual(true);
    expect(await fu.exists("/some/non-existing/path.txt")).toEqual(false);
  });

  it("should get the extension of a path or filename", () => {
    const fu = new FileUtils();
    expect(fu.ext("/some/path/file.ext")).toEqual(".ext");
    expect(fu.ext("file.ext")).toEqual(".ext");
  });
});