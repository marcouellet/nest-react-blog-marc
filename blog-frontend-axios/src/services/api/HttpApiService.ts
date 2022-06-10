import API from './APIService';

export enum EnumContentType {
  JSON = "application/json",
  XML = "application/xml",
  FORM = "application/x-www-form-urlencoded",
}
class HttpApiService<T> {

  protected getAll(endpoint: string, conf = {}): Promise<T[]> {
    return new Promise(resolve => {
      API.get<T[]>(`${endpoint}`, conf)
        .then(response => {
          resolve(response.data);
        });
     });
  }

  protected get(endpoint: string, conf = {}): Promise<T> {
    return new Promise(resolve => {
      API.get<T>(`${endpoint}`, conf)
        .then(response => {
          resolve(response.data);
        });
     });
  }

  protected getCount(endpoint: string, conf = {}): Promise<number> {
    return new Promise(resolve => {
      API.get<number>(`${endpoint}`, conf)
        .then(response => {
          resolve(response.data);
        });
     });
  }

  protected create(endpoint: string, data: {}, conf = {}): Promise<T> {
    return this.post(endpoint, data, conf)
  }

  protected post(endpoint: string, data: {}, conf = {}): Promise<T> {
    return new Promise(resolve => {
      API.post<T>(`${endpoint}`, data, conf)
        .then(response => {
          resolve(response.data);
        });
    });
  }

  protected update(endpoint: string, data: T, conf = {}): Promise<T> {
    return new Promise(resolve => {
      API.put<T>(`${endpoint}`, data, conf)
        .then(response => {
          resolve(response.data);
        });
     });
  }

  protected delete(endpoint: string, conf = {}): Promise<T> {
    return new Promise(resolve => {
      API.delete<T>(`${endpoint}`, conf)
        .then(response => {
          resolve(response.data);
        });
    });
  }
}

export default HttpApiService;