import { Module } from "@core/di";
import { UtilsModule } from "../utils";
import { Config } from "./Config";
import { ConfigKey } from "./ConfigKeys";

export { Config, ConfigKey };

@Module({
  imports: [UtilsModule, Config],
  exports: [Config]
})
export class ConfigModule {}
