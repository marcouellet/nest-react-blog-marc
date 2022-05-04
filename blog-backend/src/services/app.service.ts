import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {

  getServerInfo(): string {
    return 'Marc Nest Blog API';
  }
}
