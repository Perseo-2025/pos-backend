import { PartialType } from '@nestjs/mapped-types';
import { CreateCouponDto } from './create-coupon.dto';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class UpdateCouponDto extends PartialType(CreateCouponDto) {
    @IsNotEmpty({message: 'El nombre del cupon es validatorio'})
    name: string;

    @IsNotEmpty({message: 'El porcentaje del cupon es validatorio'})
    @IsInt({message: 'El porcentaje del cupon debe ser un numero'})
    @Max(100, {message: 'El porcentaje del cupon no puede ser mayor a 100'})
    @Min(1, {message: 'El porcentaje del cupon no puede ser menor a 1'})
    porcentage: number;
    
}
