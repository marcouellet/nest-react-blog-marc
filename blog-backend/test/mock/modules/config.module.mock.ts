import { Module, Global } from '@nestjs/common';
import { ConfigServiceMock } from '../config/config.service.mock';
@Global()
@Module({
  providers: [ConfigServiceMock],
  exports: [ConfigServiceMock],
})
export class ConfigModuleMock {}
