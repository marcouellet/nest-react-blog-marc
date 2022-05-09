export interface IGenericDataServicesRepository<T> {
  getAll(): Promise<T[]>;

  get(id: string): Promise<T>;

  findOne(criterias: {}): Promise<T>;

  findMany(criterias: {}): Promise<T[]>;

  create(item: T): Promise<T>;

  update(id: string, update: {}, populate: string): Promise<T>;

  delete(id: string): Promise<T>;

  convertToGenericEntity(obj: any): T;

  convertFromGenericEntity(obj: any): T;
}
