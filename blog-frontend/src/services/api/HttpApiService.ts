import { AxiosService } from './AxiosService';

export enum EnumContentType {
  JSON = "application/json",
  XML = "application/xml",
  FORM = "application/x-www-form-urlencoded",
}
export class HttpApiService<T> {

  private get$<T>(endpoint: string, conf = {}): Promise<T> {
    return AxiosService.get<T>(`${endpoint}`, conf)
    .then(response =>response.data);
  }

  private put$<T>(endpoint: string, data: {}, conf = {}): Promise<T> {
    return AxiosService.put<T>(`${endpoint}`, data, conf)
    .then(response =>response.data);
  }

  private post$<T>(endpoint: string, data: {}, conf = {}): Promise<T> {
    return AxiosService.post<T>(`${endpoint}`, data, conf)
    .then(response => response.data);
  }

  private delete$<T>(endpoint: string, conf = {}): Promise<T> {
    return AxiosService.delete<T>(`${endpoint}`, conf)
    .then(response => response.data);
  }

  protected getAll(endpoint: string, conf = {}): Promise<T[]> {
    return this.get$<T[]>(endpoint, conf);
  }

  protected get(endpoint: string, conf = {}): Promise<T> {
    return this.get$<T>(endpoint, conf);
  }

  protected getCount(endpoint: string, conf = {}): Promise<number> {
    return this.get$<number>(endpoint, conf);
  }

  protected findMany(endpoint: string, data: {}, conf = {}): Promise<T[]> {
    return this.post$<T[]>(endpoint, data, conf);
  }

  protected create(endpoint: string, data: {}, conf = {}): Promise<T> {
    return this.post(endpoint, data, conf)
  }

  protected post(endpoint: string, data: {}, conf = {}): Promise<T> {
    return this.post$<T>(endpoint, data, conf);
  }

  protected update(endpoint: string, data: {}, conf = {}): Promise<T> {
    return this.put$<T>(endpoint, data, conf);
  }

  protected delete(endpoint: string, conf = {}): Promise<T> {
    return this.delete$<T>(endpoint, conf);
  }
}
