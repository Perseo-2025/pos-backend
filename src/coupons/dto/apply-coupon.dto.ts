import { IsNotEmpty } from "class-validator";


export class ApplyCouponDto {

    @IsNotEmpty({message: 'El campo coupon es obligatorio'})
    coupon_name: string;

}