import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

import { HEADER_HTTP_RESPONSE_HEADER_TIMESTAMP } from 'config/config.constants';

@Injectable()
export class HeadersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    // When the request is HTTP
    if (context.getType() === 'http') {
      const res = context.switchToHttp().getResponse();
      res.header(HEADER_HTTP_RESPONSE_HEADER_TIMESTAMP, Date.now());
    }

    return next.handle();
  }
}