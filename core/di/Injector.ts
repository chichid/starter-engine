import { ModuleResolver } from "./ModuleResolver";
import { getProperty, setProperty } from "./utils";

// tslint:disable-next-line
export function Injector(mod: any): Inj {
  const m = getProperty(mod, "module") as ModuleResolver;

  if (!m) {
    throw new Error(`Unable to get injector for module ${mod.name}`);
  }

  setProperty(m, "name", mod.name);

  return new Inj(m);
}

class Inj {
  constructor(private module: ModuleResolver) {}
  public create(T: any) {
    return this.module.create(T);
  }
}
