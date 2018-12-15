import { Container } from "inversify";
import "reflect-metadata";
import { InjectableMetadata } from "./Injectable";
import { ModuleMetadata } from "./ModuleMetadata";
import { getProperty } from "./utils";

export class ModuleResolver {
  private container: Container;
  private importedTypes: Map<string, any>;

  get exports() {
    return this.metadata.exports;
  }

  constructor(private metadata: ModuleMetadata) {
    this.importedTypes = new Map<string, string>();

    if (!this.metadata) {
      this.metadata = {};
    }

    this.initContainer();
  }

  public create(T: any) {
    const type = T.name;
    const moduleHasType: boolean = !!this.importedTypes.get(type);

    if (!moduleHasType) {
      throw new Error(
        `${type} is not declared in module ${getProperty(this, "name")}`
      );
    }

    return this.container.get<typeof T>(T);
  }

  private initContainer() {
    this.container = new Container();
    this.processImports();
  }

  private processImports() {
    const imports = this.metadata.providers;

    if (!imports) {
      return;
    }

    for (const imp of imports) {
      const m = getProperty(imp, "module");
      if (m instanceof ModuleResolver) {
        this.importModuleExports(m as ModuleResolver);
      } else {
        this.importDependency(imp);
      }
    }
  }

  private importModuleExports(mod: ModuleResolver) {
    if (mod && mod.metadata && mod.metadata.exports) {
      for (const modImport of mod.metadata.exports) {
        this.importDependency(modImport);
      }
    }
  }

  private importDependency(dep: any) {
    if (dep.dependency && dep.cls) {
      this.importClass(dep.dependency.name, dep.dependency, dep.cls, true);
    } else if (dep.dependency && dep.factory) {
      this.importClass(dep.dependency.name, dep.dependency, dep.factory);
    } else if (dep.dependency) {
      throw new Error(
        `Unable to import ${dep.dependency.name},` +
          "please specify either a factory or a cls attribute" +
          "when using this syntax"
      );
    } else if (dep.name) {
      this.importClass(dep.name, dep);
    } else {
      const modName = getProperty(this, "name");
      throw new Error(`Unable to import ${dep} within ${modName}`);
    }
  }

  private importClass(type, dep, factoryOrCls?, isCls?) {
    let binding: any = this.container.bind(dep);

    if (isCls) {
      binding = binding.to(factoryOrCls);
    } else if (factoryOrCls) {
      binding = binding.toFactory(factoryOrCls);
    } else {
      binding = binding.toSelf();
    }

    binding = this.applyImportMetadata(dep, binding);

    this.importedTypes.set(type, dep);
  }

  private applyImportMetadata(dep, binding): void {
    let mdBinding = binding;

    const metadata = getProperty(
      dep,
      "injectableMetadata"
    ) as InjectableMetadata;

    if (!metadata) {
      return mdBinding;
    }

    if (metadata.singleton) {
      mdBinding = mdBinding.inSingletonScope();
    }

    return mdBinding;
  }
}
