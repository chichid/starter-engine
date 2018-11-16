import { readFile } from 'fs';

export class FileUtils {
  static async readFile(path: string): Promise<string> {
    return new Promise<string>((r, j) => {
      FileUtils.readFilePromiseImpl(path, r, j);
    });
  }

  private static readFilePromiseImpl(path: string, resolve: Function, reject: Function) {
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