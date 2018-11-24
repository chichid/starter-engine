import "reflect-metadata";
import { Container } from "inversify";
import { setProperty, getProperty } from "./utils";

class ModuleMetadata {
  // tslint:disable-next-line
  imports?: Array<any> = [];
  // tslint:disable-next-line
  exports?: Array<any> = [];
}

// tslint:disable-next-line
export function Module(metadata?: ModuleMetadata) {
  return _modDecorator.bind(metadata);
}

// tslint:disable-next-line
export function _modDecorator(target: any) {
  const mod = new Mod(this);
  setProperty(target, "module", mod);
  return target;
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
      throw `${type} is not declared in module ${getProperty(this, "name")}`;
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
      const m = getProperty(imp, "module");
      if (m instanceof Mod) {
        this.importModuleExports(m as Mod);
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
