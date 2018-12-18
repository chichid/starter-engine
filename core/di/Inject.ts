import { inject } from "inversify";
import "reflect-metadata";
import { MetaKey } from "./Constants";
import { InjectableMetadata } from "./InjectableMetadata";
import { setProperty } from "./utils";

// tslint:disable-next-line
export function Inject(target: any, key: string, index?: number): any {
  const t = Reflect.getMetadata("design:type", target, key);
  return inject(t)(target, key, index);
}
