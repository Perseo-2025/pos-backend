import { Product } from "../../products/entities/product.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

// aqui existe una relación inversa

@Entity()
export class Transaction {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal')
    total: number;

    //agregando el cupo
    @Column({type: 'varchar', length: 50, nullable: true})
    coupon: string;

    @Column({type: 'decimal', default: 0})
    discount: number; //descuento aplicado

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)'})
    created_at: Date;

    @OneToMany(() => TransactionContents, (transaction) => transaction.transaction)
    contents: TransactionContents[]
}

@Entity()
export class TransactionContents {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int') //cantidad para el carrito
    quantity: number; //cantidad total de la suma de todos los productos

    @Column('decimal')
    price: number;

    @ManyToOne(() => Product, (product) => product.id, {eager: true, cascade: true})
    product: Product

    @ManyToOne(() => Transaction, (transaction) => transaction.contents, {cascade: true})
    transaction: Transaction
}


//Modelo final 
//"id",
//"total":
//"created_at",
//"contents": []
//
//]
//
//
//
//