import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {

    @IsNotEmpty({message: 'El nombre del producto es obligatorio'})
    @IsString({message: 'El nombre debe de ser de tipo string'})
    name: string;

    @IsNotEmpty({message: 'La precio del producto es obligatorio'})
    @IsNumber({maxDecimalPlaces: 2},{message: 'El precio debe de ser de tipo number'})
    price: number;

    @IsNotEmpty({message: 'La precio del producto es obligatorio'})
    @IsNumber({maxDecimalPlaces: 0},{message: 'Cantidad no válida'})
    stock: number;

    @IsNotEmpty({message: 'La categoria del producto es obligatorio'})
    @IsInt({message: 'La categoria no es válida'})
    categoryId: number;
}
