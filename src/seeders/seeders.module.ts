import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true
      }),
      TypeOrmModule.forRootAsync({
          useFactory: typeOrmConfig,
          inject:[ConfigService]
      }),
      TypeOrmModule.forFeature([Product,Category]) // Add your entities here
    ],
  providers: [SeedersService]
})
export class SeedersModule {}
