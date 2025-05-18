import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //app.setGlobalPrefix('api/v1')//prefijo de la api

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true    
  }))


  const config = new DocumentBuilder()
    .setTitle('API de POS')
    .setDescription("API de POS descripcion")
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);


  app.useStaticAssets(join(__dirname, '../public'))//leer la imagen
  
  await app.listen(process.env.PORT || 3000);

}
bootstrap();
