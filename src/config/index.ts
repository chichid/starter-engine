import { FileUtils } from "../utils";
import { Config } from "./Config";
import { ConfigKey } from "./ConfigKeys";
import { Module } from "../core";

export { Config, ConfigKey };

export default Module({
  imports: [FileUtils],
  exports: [Config]
});
