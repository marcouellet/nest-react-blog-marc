import { Module } from '@nestjs/common';
import { DataServicesModule } from './data-services.module';
import { AuthorFactoryService } from '../services/author/author-factory.service';
import { AuthorService } from '../services/author/author.service';

@Module({
  imports: [DataServicesModule],
  providers: [AuthorFactoryService, AuthorService],
  exports: [AuthorFactoryService, AuthorService],
})
export class AuthorModule {}
