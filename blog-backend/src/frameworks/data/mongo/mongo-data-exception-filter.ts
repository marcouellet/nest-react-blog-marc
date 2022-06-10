import { ArgumentsHost, Catch, Logger, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoDataExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    Logger.error(exception); // <-- for example, ECONNREFUSED error
  }
}
