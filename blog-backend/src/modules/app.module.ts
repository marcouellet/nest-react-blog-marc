import { Module } from '@nestjs/common';
import { ConfigModule } from '../configuration'
import { ConfigService, CONFIG_MODULE_OPTIONS} from '../configuration'
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { AuthorModule } from './author.module';
import { PostModule } from './post.module';
import { DataServicesModule } from '../frameworks/data-services/data-services.module';

@Module({
  imports: [
    ConfigModule.register(CONFIG_MODULE_OPTIONS),
    DataServicesModule.configure(CONFIG_MODULE_OPTIONS),
    AuthorModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [ConfigService, AppService],
})
export class AppModule {}
