import { Module } from '@nestjs/common';
import { AuthorFactoryService } from '../services/author/author-factory.service';
import { AuthorService } from '../services/author/author.service';

@Module({
  providers: [AuthorFactoryService, AuthorService],
  exports: [AuthorFactoryService, AuthorService],
})
export class AuthorModule {}
