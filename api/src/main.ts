import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FormdataInterceptor,
  DefaultFileSaver,
} from 'nestjs-formdata-interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: 'https://blog-app-dn7e.onrender.com/',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Blog example')
    .setDescription('The blog API description')
    .setVersion('1.0')
    .addTag('blog')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useGlobalInterceptors(
    new FormdataInterceptor({
      customFileName(context, originalFileName) {
        return `${Date.now()}-${originalFileName}`;
      },
      fileSaver: new DefaultFileSaver({
        prefixDirectory: './public',
        customDirectory(context, originalDirectory) {
          return originalDirectory;
        },
      }),
    }),
  );
  await app.listen(5050);
}
bootstrap();
