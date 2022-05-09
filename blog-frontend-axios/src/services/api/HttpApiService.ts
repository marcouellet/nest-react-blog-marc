import API from './APIUtils';

export enum EnumContentType {
  JSON = "application/json",
  XML = "application/xml",
  FORM = "application/x-www-form-urlencoded",
}
class HttpApiService<T> {

  protected getAll(endpoint: string, conf = {}): Promise<T[]> {
    return new Promise((resolve, reject) => {
      API.get<T[]>(`${endpoint}`, conf)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  protected get(endpoint: string, conf = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      API.get<T>(`${endpoint}`, conf)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  protected create(endpoint: string, data: {}, conf = {}): Promise<T> {
    return this.post(endpoint, data, conf)
  }

  protected post(endpoint: string, data: {}, conf = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      API.post<T>(`${endpoint}`, data, conf)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  protected update(endpoint: string, data: T, conf = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      API.put<T>(`${endpoint}`, data, conf)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  protected delete(endpoint: string, conf = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      API.delete<T>(`${endpoint}`, conf)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

export default HttpApiService;