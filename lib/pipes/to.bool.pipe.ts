import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";
import { DataUtil } from "utils/data.util";

@Injectable()
export class RequiredPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return DataUtil.toBool(value);
  }
}
