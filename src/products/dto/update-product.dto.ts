import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty, IsNumber, IsNumberString, IsString } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  
    @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
    @IsString({ message: 'El nombre debe de ser de tipo string' })
    name: string;

    @IsNumber({maxDecimalPlaces: 2},{message: 'El precio debe de ser de tipo number'})
    price?: number;

    @IsNumber({maxDecimalPlaces: 0},{message: 'Cantidad no válida'})
    stock?: number;


}
