import { readFile, exists } from 'fs';
import { Injectable } from '@core/Injectable';

@Injectable()
export class FileUtils {
  async readFile(path: string): Promise<string> {
    return new Promise<string>((r, j) => {
      this.readFileImpl(path, r, j);
    });
  }

  async exists(path: string): Promise<boolean> {
    return new Promise<boolean>((r, j) => {
      this.existsImpl(path, r, j);
    });
  }

  private existsImpl(path: string, resolve: Function, reject: Function) {
    exists(path, (exists: boolean) => resolve(exists));
  }

  private readFileImpl(path: string, resolve: Function, reject: Function) {
    readFile(path, (err: any, data: any) => {
      if (err) {
        reject(err);
        return;
      }

      const content = data.toString();
      resolve(content);
    });
  }
}