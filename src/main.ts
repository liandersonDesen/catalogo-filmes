import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('API de Filmes')
  .setDescription('Documentação Swagger para CRUD de Filmes')
  .setVersion('1.0')
  .addBearerAuth({// Esquema JWT Bearer
    type:'http',
    scheme:'bearer',
    bearerFormat:'JWT',
    name:'Authorization',
    in:'header'
    })
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true,
      transform: true, 
    })
  );

  await app.listen(process.env.PORT ?? 3000);

  const logger = new Logger('Bootstrap'); 
  const appUrl = await app.getUrl();
  logger.log(`🚀 Servidor rodando em: ${appUrl.replace('[::1]', 'localhost').replace('0.0.0.0', 'localhost')}`);
  
}
bootstrap();
