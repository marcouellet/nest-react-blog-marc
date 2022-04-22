import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { AuthorModule } from './author.module';
import { PostModule } from './post.module';
import { DataServicesModule } from '../frameworks/data-services/data-services.module';
import { MongoDataServicesModule } from '../frameworks/data-services/mongo/mongo-data-services.module';
import { MONGO_DATA_BASE_SERVER_CONFIGURATION } from '../configuration';

@Module({
  imports: [
    AuthorModule,
    PostModule,
    DataServicesModule.forDataServicesModule(MongoDataServicesModule.forDataServer())
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
