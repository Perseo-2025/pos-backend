import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { Repository, DataSource } from 'typeorm';
import { categories, products } from '../data';

@Injectable()
export class SeedersService {

    constructor(
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        private dataSource: DataSource
    ){}

    async onModuleInit(){
        const connection = this.dataSource
        await connection.dropDatabase()
        await connection.synchronize()
        await this.seed()
        console.log('🌱 Seeders finished')
    }



    async seed(){

        await this.categoryRepository.save(categories)
        console.log(categories)

        for await (const seedProduct of products){
            
            const category = await this.categoryRepository.findOneBy({id: seedProduct.categoryId})

            if(!category){
                console.warn(`Category with id ${seedProduct.categoryId} not found`)
                continue
            }
            
            const product = this.productRepository.create({
                name: seedProduct.name,
                image: seedProduct.image,
                price: seedProduct.price,
                stock: seedProduct.stock,
                category
            });

            await this.productRepository.save(product)
        }
        
        console.log('🌱 Seeders ejecutado')
    }



}
