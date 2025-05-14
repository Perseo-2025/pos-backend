import { IsString } from "class-validator";
import { Product } from "../../products/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Category{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar'})
    @IsString()
    name: string;

    //una categoria puede tener multiples productos
    @OneToMany(() => Product, (product) => product.category, {cascade: true})
    products: Product[]

}
