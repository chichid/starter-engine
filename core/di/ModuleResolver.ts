import { Container, METADATA_KEY } from "inversify";
import "reflect-metadata";
import { MetaKey } from "./Constants";
import { InjectableMetadata } from "./InjectableMetadata";
import { ModuleMetadata } from "./ModuleMetadata";
import { getProperty } from "./utils";

export class ModuleResolver {
  private container: Container;
  private importedTypes: Map<string, any>;

  get exports() {
    return this.metadata.exports;
  }

  constructor(private metadata?: ModuleMetadata) {
    if (!this.metadata) {
      this.metadata = {};
    }

    this.importedTypes = new Map<string, string>();
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

    if (this.metadata.providers) {
      this.processProviders();
    }

    if (this.metadata.imports) {
      this.processImports();
    }
  }

  private processProviders() {
    for (const p of this.metadata.providers) {
      this.importDependency(p);
    }
  }

  private processImports() {
    for (const imp of this.metadata.imports) {
      const mod = getProperty(imp, MetaKey.MODULE_RESOLVER) as ModuleResolver;

      if (mod) {
        this.importModule(mod);
      } else {
        throw new Error(
          `Unable to import module ${
            imp.name
          }, maybe it's missing a @Module decorator`
        );
      }
    }
  }

  private importModule(mod: ModuleResolver) {
    if (mod.container) {
      this.container = Container.merge(
        mod.container,
        this.container
      ) as Container;

      this.importedTypes = new Map([
        ...Array.from(this.importedTypes.entries()),
        ...Array.from(mod.importedTypes.entries())
      ]);
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
    const metadata = getProperty(dep, MetaKey.INJECTABLE_METADATA);
    if (!metadata) {
      throw new Error(
        `Unable to import provider ${
          metadata.name
        }, maybe it's missing a @Injectable decorator or it's missing from the providers declaration`
      );
    }

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
      MetaKey.INJECTABLE_METADATA
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
