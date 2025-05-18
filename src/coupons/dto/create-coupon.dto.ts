import { IsDateString, IsInt, IsNotEmpty, Max, Min } from "class-validator";

export class CreateCouponDto {

    @IsNotEmpty({message: 'El nombre del cupon es validatorio'})
    name: string;

    @IsNotEmpty({message: 'El porcentaje del cupon es validatorio'})
    @IsInt({message: 'El porcentaje del cupon debe ser un numero'})
    @Max(100, {message: 'El porcentaje del cupon no puede ser mayor a 100'})
    @Min(1, {message: 'El porcentaje del cupon no puede ser menor a 1'})
    porcentage: number;


    @IsNotEmpty({message: 'La fecha de expiracion del cupon es validatorio'})
    @IsDateString({},{message: 'La fecha de expiracion del cupon debe ser una fecha valida'})
    expirationDate: Date;

}
