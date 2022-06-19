import { Logger } from '@nestjs/common';
import { CustomLogger } from './common/custom.logger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { GLOBAL_CONFIG_SERVICE } from './config/config.global';

async function bootstrap() {
  try {
    CustomLogger.setGlobalPrefix('Marc Blog Server');
    const app = await NestFactory.create(
      AppModule.register(GLOBAL_CONFIG_SERVICE), {
      logger: new CustomLogger(),
      abortOnError: false,
    }).catch((err) => { throw Error(err); });
    app.setGlobalPrefix('api');
    app.enableCors();
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(5000);
    Logger.log('Marc Blog Server is up and running!');
  } catch (err) {
    Logger.error(err); // <-- for example, ECONNREFUSED error
  }
}
bootstrap();
