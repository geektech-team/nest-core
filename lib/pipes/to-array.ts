import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";
import { DataUtil } from "utils/data";

@Injectable()
export class RequiredPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return DataUtil.toArray(value);
  }
}
