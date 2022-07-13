export interface IGenericDataRepository<T> {
  getAll(): Promise<T[]>;

  get(id: string): Promise<T>;

  findOne(criterias: {}): Promise<T>;

  findMany(criterias: {}): Promise<T[]>;

  findManyCount(criterias: {}): Promise<number>;

  findManyCountForSubDocument(idProperty: string, value: string, criterias: {}): Promise<number>;

  findManyForSubDocument(subDocumentName: string, subDocumentId: string, criterias: {}): Promise<T[]>;

  create(item: T): Promise<T>;

  unset(id: string, unserParms: {}): Promise<void>;

  update(id: string, update: {}, populate?: string | string[], options?: any): Promise<T>;

  delete(id: string, populate?: string | string[]): Promise<T>;

  convertToGenericEntity(obj: any): T;

  convertFromGenericEntity(obj: any): T;
}
