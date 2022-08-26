import { Controller, Get } from '@nestjs/common';
import { AppService } from '@Services/app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  getServerInfo(): string {
    return this.appService.getServerInfo();
  }
}
