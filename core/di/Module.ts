import { Container } from "inversify";
import "reflect-metadata";

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
  target.___core_di_module = mod;
  return target;
}

// tslint:disable-next-line
export function Injector(mod: any): Inj {
  const { ___core_di_module } = mod;

  if (!___core_di_module) {
    throw `Unable to get injector for module ${mod.name}`;
  }

  const m = ___core_di_module as Mod;
  (m as any).___core_di_name = mod.name;
  return new Inj(m);
}

class Inj {
  constructor(private module: Mod) {}
  create(T: any) {
    return this.module.create(T);
  }
}

class Mod {
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
      throw `${type} is not declared in module ${
        (this as any).___core_di_name
      }`;
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
      if (imp.___core_di_module) {
        this.importModuleExports(imp.___core_di_module as Mod);
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
