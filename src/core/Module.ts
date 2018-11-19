import { Container } from "inversify";
import "reflect-metadata";

class ModuleMetadata {
  // tslint:disable-next-line
  imports?: Array<any> = [];
  // tslint:disable-next-line
  exports?: Array<any> = [];
}

// tslint:disable-next-line
export function Module(metadata: ModuleMetadata): Mod {
  return new Mod(metadata);
}

export class Mod {
  private container: Container;

  get exports() {
    return this.metadata.exports;
  }

  constructor(private metadata: ModuleMetadata) {
    if (this.metadata) {
      this.initContainer();
    }
  }

  create(T: any) {
    return this.container.resolve<typeof T>(T);
  }

  private initContainer() {
    this.container = new Container();
    this.processImports();
  }

  private processImports() {
    const imports = this.metadata.imports;

    if (!imports) {
      return;
    }

    for (const imp of imports) {
      if (imp instanceof Module) {
        this.importModuleExports(imp as Mod);
      } else {
        this.importDependency(imp);
      }
    }
  }

  private importModuleExports(mod: Mod) {
    if (mod && mod.metadata && mod.metadata.exports) {
      for (const modImport of mod.metadata.exports) {
        this.importDependency(modImport);
      }
    }
  }

  private importDependency(dep: any) {
    this.container.bind(dep).toSelf();
  }
}
