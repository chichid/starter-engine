import { getProperty, setProperty } from "./utils";
import { Mod } from "./Module";

// tslint:disable-next-line
export function Injector(mod: any): Inj {
  const m = getProperty(mod, "module") as Mod;

  if (!m) {
    throw `Unable to get injector for module ${mod.name}`;
  }

  setProperty(m, "name", mod.name);

  return new Inj(m);
}

class Inj {
  constructor(private module: Mod) { }
  create(T: any) {
    return this.module.create(T);
  }
}
