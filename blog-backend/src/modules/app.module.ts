import { Module } from '@nestjs/common';
import { ConfigModule } from '../configuration'
import { ConfigService, ConfigDataService} from '../configuration'
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { AuthorModule } from './author.module';
import { PostModule } from './post.module';
import { DataServicesModule } from '../frameworks/data-services/data-services.module';
import { MongoDataServicesModule } from '../frameworks/data-services/mongo/mongo-data-services.module';
import { CONFIG_MODULE_OPTIONS } from '../configuration';

@Module({
  imports: [
    ConfigModule.register(CONFIG_MODULE_OPTIONS),
    AuthorModule,
    PostModule,
    DataServicesModule.forDataServicesModule(MongoDataServicesModule.forDataServer())
  ],
  controllers: [AppController],
  providers: [ConfigService, ConfigDataService, AppService],
})
export class AppModule {}
