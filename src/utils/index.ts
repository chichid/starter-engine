import { Module } from "@core/di";
import { FileUtils } from "./FileUtils";

export { FileUtils };

@Module({
  providers: [FileUtils]
})
export class UtilsModule {}
