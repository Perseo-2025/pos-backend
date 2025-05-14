import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import {Type} from 'class-transformer'
import { TransactionContentsDto } from "./transaction-contents.dto";

export class CreateTransactionDto {
  @IsNotEmpty({message: 'El Total no puede ir vacio'})
  @IsNumber({}, {message: 'Cantidad no válida'})
  total: number

  @IsArray()
  @ArrayNotEmpty({message: 'Los Contenidos no pueden ir vacios'})
  @ValidateNested()
  @Type(() => TransactionContentsDto)
  contents: TransactionContentsDto[]
}
