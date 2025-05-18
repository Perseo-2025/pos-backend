import { NestFactory } from '@nestjs/core';
import { SeedersModule } from './seeders/seeders.module';
import { SeedersService } from './seeders/seeders.service';


async function bootstrap() {
  const app = await NestFactory.create(SeedersModule);
  const seeder = app.get(SeedersService);
 /*  await app.init(); */
  await seeder.seed();
  await app.close();

}
bootstrap();
