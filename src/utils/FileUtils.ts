import { readFile, exists } from 'fs';

export class FileUtils {
  static async readFile(path: string): Promise<string> {
    return new Promise<string>((r, j) => {
      FileUtils.readFileImpl(path, r, j);
    });
  }

  static async exists(path: string): Promise<boolean> {
    return new Promise<boolean>((r, j) => {
      FileUtils.existsImpl(path, r, j);
    });
  }
  
  static existsImpl(path: string, resolve: Function, reject: Function) {
    exists(path, exists => resolve(exists));
  }

  private static readFileImpl(path: string, resolve: Function, reject: Function) {
    readFile(path, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const content = data.toString();
      resolve(content);
    });
  }
}