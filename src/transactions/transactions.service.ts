import { BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, Not, Repository } from 'typeorm';
import {
  TransactionContents,
  Transaction,
} from './entities/transaction.entity';
import { Product } from '../products/entities/product.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';
import { CouponsService } from '../coupons/coupons.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents)
    private readonly transactionContentsRepository: Repository<TransactionContents>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly couponService : CouponsService
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {

    await this.productRepository.manager.transaction(async (transactionnEntityManager) => {

      const transaction = new Transaction();
      
      const total = createTransactionDto.contents.reduce((total, item)=> total + (item.quantity * item.price) ,0)
      
      transaction.total = total;

      //agregando el cupon
      if(createTransactionDto.coupon){
        const coupon = await this.couponService.applyCoupon(createTransactionDto.coupon);
        console.log(coupon);
        
        const descuento = (coupon.porcentage * total) / 100;
        transaction.discount = descuento;
        transaction.coupon = coupon.name;
        transaction.total -= descuento;
      }

      for (const contents of createTransactionDto.contents) {
        const product = await transactionnEntityManager.findOneBy(Product,{id: contents.productId,});       
        
        if (contents.quantity > product.stock) {
          
          const errors = []

          if(!product){
            errors.push(`El producto ${contents.productId} no existe`)
            throw new NotFoundException(errors);
          }
          errors.push(`El articulo ${product.name} no tiene stock suficiente`)
          throw new BadRequestException();
        }
        
        product.stock -= contents.quantity;

        // Crear instancia de TransactionContents
        const transactionContent = new TransactionContents();
        transactionContent.price = contents.price;
        transactionContent.product = product;
        transactionContent.quantity = contents.quantity;
        transactionContent.transaction = transaction;

        
        await transactionnEntityManager.save(transaction); //almacena la venta
        await transactionnEntityManager.save(transactionContent); //almacena los productos de la venta
      }
    });



    return 'Venta alamcenada correctamente';
  }

  findAll(created_at?: string) {
    const options : FindManyOptions<Transaction> = {
      relations: {
        contents: true
      }
    }

    if(created_at){
      const date = parseISO(created_at) //<-convierte a fecha
      if(!isValid(date)){
        throw new BadRequestException('La fecha no es valida')
      }

      const startDay = startOfDay(date) 
      const endDay = endOfDay(date)

      options.where = {
        created_at: Between(startDay, endDay),
      }
    
    }
    
    return this.transactionRepository.find(options);
  }

  async findOne(id: number) {

    const transaction = await this.transactionRepository.findOne({
      where: {
        id
      },
      relations: {
        contents: true
      }
    })

    if(!transaction){
      throw new NotFoundException('La venta no existe')
    }

    return transaction;
  }


  async remove(id: number) {
    const transaction = await this.findOne(id)

    for(const contents of transaction.contents){

      //consuta el producto
      const product = await this.productRepository.findOneBy(
        {
          id: contents.product.id
        }
      )
      
      product.stock += contents.quantity;

      await this.productRepository.save(product)

      const transactionContentes = await this.transactionContentsRepository.findOneBy(
        {
          id:contents.id,
        }
      )
      await this.transactionContentsRepository.remove(transactionContentes)
    
    }

    await this.transactionRepository.remove(transaction)

    return {message: `Venta con la transacción: ${id}, eliminada correctamente`};
  }
}
