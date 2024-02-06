import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class StringToBooleanPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined || value === "") {
      return value
    }
    if (value === "true" || value === "1") {
      return true;
    }
    return false
  }
}
