import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";
import { ServerExceptionCode } from "../enums/server.exception.enum";
import { ServerException } from "../models/server.exception.model";

@Injectable()
export class RequiredPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined || value === "") {
      throw new ServerException(
        ServerExceptionCode.InvalidParam,
        `Param [${metadata.data}] is required`
      );
    }
    return value;
  }
}
