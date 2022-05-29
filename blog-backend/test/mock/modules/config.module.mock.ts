import { Module, Global } from '@nestjs/common';
import { ConfigService } from '../../../src/services/config.service';
@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModuleMock {}
