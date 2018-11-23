import { FileUtils } from "./FileUtils";
import { Module } from "@core/di";

export { FileUtils };

@Module({
  exports: [FileUtils]
})
export class UtilsModule {}
