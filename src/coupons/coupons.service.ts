import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Repository } from 'typeorm';
import { endOfDay, isAfter } from 'date-fns';

@Injectable()
export class CouponsService {


  constructor(@InjectRepository(Coupon) private readonly couponRepository : Repository<Coupon>){}

  create(createCouponDto: CreateCouponDto) {
    return this.couponRepository.save(createCouponDto);
  }

  findAll() {
    return this.couponRepository.find();;    
  }

  async findOne(id: number) {
    const coupon = await this.couponRepository.findOne({ where: { id } });
    if (!coupon) {
      throw new Error('Coupon not found');
    }
    return coupon;
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.findOne(id)
    Object.assign(coupon, updateCouponDto);
    const resp = await this.couponRepository.save(coupon);
    return resp;
  }

  async remove(id: number) {
    const coupon = await this.findOne(id)
    await this.couponRepository.remove(coupon);
    return {message: 'Coupon deleted successfully'};
  }

  //canjear cupon
  async applyCoupon(name : string){

    const coupon = await this.couponRepository.findOneBy({name});
    if(!coupon){
      throw new NotFoundException('El cupon no existe');
    }
    
    //para ver si expira
    const currentDate = new Date()
    const expirationDate = endOfDay(coupon.expirationDate);
    
    if(isAfter(currentDate, expirationDate)){ //codigo que compara
      throw new BadRequestException('El cupón ya ha expirado');
    }

    return {
      message: 'Cupón aplicado correctamente',
      ...coupon
    }; // Return the coupon object if found
  }




}
