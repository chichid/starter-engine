import { Mod } from "./Module";
import { getProperty, setProperty } from "./utils";

// tslint:disable-next-line
export function Injector(mod: any): Inj {
  const m = getProperty(mod, "module") as Mod;

  if (!m) {
    throw new Error(`Unable to get injector for module ${mod.name}`);
  }

  setProperty(m, "name", mod.name);

  return new Inj(m);
}

class Inj {
  constructor(private module: Mod) { }
  public create(T: any) {
    return this.module.create(T);
  }
}
