import { Injectable } from "@core/di";
import { exists, readFile } from "fs";
import { extname } from "path";

@Injectable()
export class FileUtils {
  public async readFile(path: string): Promise<string> {
    return new Promise<string>((r, j) => {
      this.readFileImpl(path, r, j);
    });
  }

  public async exists(path: string): Promise<boolean> {
    return new Promise<boolean>((r, j) => {
      this.existsImpl(path, r, j);
    });
  }

  public ext(path: string): string {
    return extname(path);
  }

  private existsImpl(path: string, resolve: (boolean) => void, reject: (err) => void) {
    exists(path, e => resolve(e));
  }

  private readFileImpl(path: string, resolve: (boolean) => void, reject: (err) => void) {
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
