import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";
import {Type} from 'class-transformer'
import { TransactionContentsDto } from "./transaction-contents.dto";

export class CreateTransactionDto {
  @IsNotEmpty({message: 'El Total no puede ir vacio'})
  @IsNumber({}, {message: 'Cantidad no válida'})
  total: number;

  //agregando el cupon en la transacción
  @IsOptional()
  coupon: string;

  @IsArray()
  @ArrayNotEmpty({message: 'Los Contenidos no pueden ir vacios'})
  @ValidateNested()
  @Type(() => TransactionContentsDto)
  contents: TransactionContentsDto[]
}
