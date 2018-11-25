import { injectable } from "inversify";
import "reflect-metadata";
import { setProperty } from "./utils";

class InjectableMetadata {
  singleton?: boolean;
}

// tslint:disable-next-line
export function Injectable(metadata?: InjectableMetadata) {
  return target => {
    setProperty(target, "injectableMetadata", metadata || {});
    return injectable()(target);
  };
}
