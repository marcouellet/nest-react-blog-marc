import { Module, Global } from '@nestjs/common';
import { ConfigService } from '.'

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}