import { Module } from "@core/di";

import { FileUtils } from "../utils";
import { Config } from "./Config";
import { ConfigKey } from "./ConfigKeys";

export { Config, ConfigKey };

export default Module({
  imports: [FileUtils],
  exports: [Config]
});
