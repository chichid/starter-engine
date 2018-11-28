import { Module } from "@core/di";
import { FileUtils } from "./FileUtils";

export { FileUtils };

@Module({
  exports: [FileUtils]
})
export class UtilsModule {}
