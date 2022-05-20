import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      abortOnError: false,
      logger: console,
    }).catch((err) => { throw Error(err); });
    app.setGlobalPrefix('api');
    app.enableCors();
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(5000);
  } catch (err) {
    Logger.error(err); // <-- for example, ECONNREFUSED error
  }
}
bootstrap();
