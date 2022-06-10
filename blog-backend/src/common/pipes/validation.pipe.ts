import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from '@nestjs/class-transformer';
import { validate } from '@nestjs/class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: string, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, Object.assign({}, value));
    const errors = await validate(object, { skipMissingProperties: true });
    if (errors.length > 0) {
      throw new BadRequestException('Properties : ' + errors.map((error) => 
      `${error.property}`).join(' '));
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}
