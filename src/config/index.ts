import { Module } from "@core/di";
import { Config } from "./Config";
import { ConfigKey } from "./ConfigKeys";
import { UtilsModule } from "../utils";

export { Config, ConfigKey };

@Module({
  imports: [UtilsModule, Config],
  exports: [Config]
})
export class ConfigModule {}
