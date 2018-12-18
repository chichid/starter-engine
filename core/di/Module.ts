import { MetaKey } from "./Constants";
import { ModuleMetadata } from "./ModuleMetadata";
import { ModuleResolver } from "./ModuleResolver";
import { setProperty } from "./utils";

// tslint:disable-next-line
export function Module(metadata?: ModuleMetadata) {
  // TODO refactor to send the metadata without bind.
  return _modDecorator.bind(metadata);
}

// tslint:disable-next-line
export function _modDecorator(target: any) {
  const metadata = (this as any) || {};
  metadata.moduleName = target.name;

  const mod = new ModuleResolver(metadata);
  setProperty(target, MetaKey.MODULE_RESOLVER, mod);

  return target;
}
