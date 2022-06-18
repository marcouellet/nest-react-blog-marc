import { Logger } from '@nestjs/common';
import { CustomLogger } from './common/custom.logger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      abortOnError: false,
    }).catch((err) => { throw Error(err); });
    app.setGlobalPrefix('api');
    // app.useLogger(new CustomLogger('Marc Blog Server'));
    app.enableCors();
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(5000);
    Logger.log('Marc Blog Server is up and running!');
  } catch (err) {
    Logger.error(err); // <-- for example, ECONNREFUSED error
  }
}
bootstrap();
