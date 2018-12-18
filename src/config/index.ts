import { Module } from "@core/di";
import { Config } from "./Config";
import { ConfigKey } from "./ConfigKeys";
import UtilsModule from "../utils";

export { Config, ConfigKey };

export default Module({
  imports: [UtilsModule],
  exports: [Config]
});
