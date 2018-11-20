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
  private importedTypes: Map<string, any>;

  get exports() {
    return this.metadata.exports;
  }

  constructor(private metadata: ModuleMetadata) {
    this.importedTypes = new Map<string, string>();

    if (this.metadata) {
      this.initContainer();
    }
  }

  create(T: any) {
    const type = T.name;
    const moduleHasType: boolean = !!this.importedTypes.get(type);

    if (!moduleHasType) {
      throw `type ${type} is not declared in its parent module`;
    }

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
      if (imp instanceof Mod) {
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
    const type = dep.name;

    if (type) {
      this.importedTypes.set(type, dep);
      this.container.bind(dep).toSelf();
    } else {
      throw `Unable to import the ${dep}`;
    }
  }
}
