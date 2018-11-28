const mockReadFileContent = "Test Content";
const mockReadFileError = "Error Reading The File";
const readFile = jest.fn((path, callback) => {
  if (path === "/some/test/path.txt") {
    callback(null, mockReadFileContent);
  } else {
    callback(mockReadFileError);
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
    expect(content).toBe(mockReadFileContent);
  });

  it("should throw when no file exists", async () => {
    const fu = new FileUtils();
    const testPath = "/wrong.txt";
    expect(fu.readFile(testPath)).rejects.toEqual(mockReadFileError);
  });

  it("should check if file exists", async () => {
    const fu = new FileUtils();
    expect(fu.exists("/some/existing/path.txt")).resolves.toEqual(true);
    expect(fu.exists("/some/non-existing/path.txt")).resolves.toEqual(false);
  });

  it("should get the extension of a path or filename", () => {
    const fu = new FileUtils();
    expect(fu.ext("/some/path/file.ext")).toEqual(".ext");
    expect(fu.ext("file.ext")).toEqual(".ext");
  });
});