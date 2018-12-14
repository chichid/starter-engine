import { ModuleMetadata } from "./ModuleMetadata";
import { ModuleResolver } from "./ModuleResolver";
import { setProperty } from "./utils";

// tslint:disable-next-line
export function Module(metadata?: ModuleMetadata) {
  return _modDecorator.bind(metadata);
}

// tslint:disable-next-line
export function _modDecorator(target: any) {
  const mod = new ModuleResolver(this);
  setProperty(target, "module", mod);
  return target;
}
