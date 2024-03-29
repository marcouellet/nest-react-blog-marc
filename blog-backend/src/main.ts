import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';

import { AppModule } from 'modules/app.module';
import { CustomLogger } from 'common/custom.logger';
import { HttpExceptionFilter } from 'common/http-exception.filter';
import { HeadersInterceptor } from 'common/header.interceptor';
import { GLOBAL_CONFIG_SERVICE } from 'config/config.global';
import { HEADER_HTTP_RESPONSE_HEADER_TIMESTAMP } from 'config/config.constants';

async function bootstrap() {
  try {
    CustomLogger.setGlobalPrefix('Marc Blog Server');
    const app = await NestFactory.create(
      AppModule.register(GLOBAL_CONFIG_SERVICE), {
      logger: new CustomLogger(),
      abortOnError: false,
    }).catch((err) => { throw Error(err); });
    app.setGlobalPrefix('api');
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.enableCors({exposedHeaders: [HEADER_HTTP_RESPONSE_HEADER_TIMESTAMP]});
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new HeadersInterceptor());

    const config = GLOBAL_CONFIG_SERVICE.getConfig();
    await app.listen(config.serverPort);

    Logger.log('Server listening on port ' + config.serverPort);
    Logger.log('Server database url is ' + config.connectionString);
    Logger.log('Marc Blog Server is up and running!');
  } catch (err) {
    Logger.error(err); // <-- for example, ECONNREFUSED error
  }
}
bootstrap();
