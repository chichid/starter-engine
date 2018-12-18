import { injectable } from "inversify";
import "reflect-metadata";
import { InjectableMetadata } from "./InjectableMetadata";
import { setProperty } from "./utils";

// tslint:disable-next-line
export function Injectable(metadata?: InjectableMetadata) {
  return target => {
    setProperty(target, "injectableMetadata", metadata || {});
    return injectable()(target);
  };
}
