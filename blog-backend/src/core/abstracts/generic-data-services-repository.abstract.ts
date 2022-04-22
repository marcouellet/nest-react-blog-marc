export interface IGenericDataServicesRepository<T> {
  getAll(): Promise<T[]>;

  get(id: string): Promise<T>;

  create(item: T): Promise<T>;

  update(id: string, item: T);

  delete(id: string);
}
