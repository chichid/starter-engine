import { inject } from "inversify";
import "reflect-metadata";

// tslint:disable-next-line
export function Inject(target: any, key: string, index?: number): any {
  const t = Reflect.getMetadata("design:type", target, key);
  return inject(t)(target, key, index);
}
