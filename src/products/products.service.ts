import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product) private readonly productRepository : Repository<Product>,
    @InjectRepository(Category) private readonly categoryRepository : Repository<Category>
  ) {}

  async create(createProductDto: CreateProductDto) {

    const category = await this.categoryRepository.findOneBy({id: createProductDto.categoryId});

    if(!category) {
      let errors = [];
      errors.push()
      throw new NotFoundException('La categoria no existe');
    }  

    return this.productRepository.save({...createProductDto, category});
  }

  async findAll(categoryId: number, take: number, skip: number) { //IDEAL PARA UNA PAGINACIÓN
    
    const options : FindManyOptions<Product> = {
      relations: {
        category: true
      },
      order: {
        id: 'DESC'
      },
      take,
      skip, //salta los resultados iniciales
    }

    if(categoryId){ //si hay un id de categoria en el filtro se pagina
        options.where = {
          category: {
            id: categoryId
          }
        }      
    }

    const [data, total] = await this.productRepository.findAndCount(options); //jala la relacion con la categoria  

    return {
      data, 
      total
    };

  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where:{
        id
      },
      relations: {
        category: true
      }
    }); 

    //edita los datos del cliente
    if(!product){
      throw new NotFoundException('El producto con el Id indicado no existe');
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto); //muta el product y usa el DTO
    
    if(updateProductDto.categoryId){ //cambiar de categoria relacionado
      const category = await this.categoryRepository.findOneBy({id: updateProductDto.categoryId});
      if(!category){
        let error: string [] = [];
        error.push('La categoria no existe');
        throw new NotFoundException(error);
      }
      product.category = category;
    }
    const rsp = await this.productRepository.save(product);
    return rsp;
  
  }

  async remove(id: number) {

    const product = await this.findOne(id);

    if(!product){
        let error: string [] = [];
        error.push('El producto no existe');
        throw new NotFoundException(error);
      }

    await this.productRepository.remove(product);

    return 'Producto eliminado!!!';
  }
}
