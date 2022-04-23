import { Injectable } from '@nestjs/common';
import { Author } from '../../core/entities';
import { IDataServicesRepositories } from '../../core/abstracts';
import { CreateAuthorDto, UpdateAuthorDto } from '../../core/dtos';
import { AuthorFactoryService } from './author-factory.service';

@Injectable()
export class AuthorService {

  constructor(
    private dataRepositories: IDataServicesRepositories,
    private authorFactoryService: AuthorFactoryService,
  ) {}

  getAllAuthors(): Promise<Author[]> {
    return this.dataRepositories.authors.getAll();
  }

  getAuthorById(id: any): Promise<Author> {
    return this.dataRepositories.authors.get(id);
  }

  createAuthor(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const author = this.authorFactoryService.createNewAuthor(createAuthorDto);
    return this.dataRepositories.authors.create(author);
  }

  updateAuthor(
    authorId: string,
    updateAuthorDto: UpdateAuthorDto,
  ): Promise<Author> {
    const author = this.authorFactoryService.updateAuthor(updateAuthorDto);
    return this.dataRepositories.authors.update(authorId, author);
  }

  deleteAuthor(id: any) : Promise<Author>
  {
    return this.dataRepositories.authors.delete(id);
  }
}
