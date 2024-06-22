import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class StringToNumberArrayPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined || value === '') {
      return value;
    }
    const substrings = value.split(',');
    return substrings.map((substring) => Number(substring));
  }
}
