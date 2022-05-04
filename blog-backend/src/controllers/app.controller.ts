import { Controller, Get, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { AppService } from '../services';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getServerInfo(): string {
    return this.appService.getServerInfo();
  }
}
