import axios, { AxiosPromise } from 'axios';
import API from './APIUtils';
import { useAuth0 } from '../../contexts/auth0-context';

export enum EnumContentType {
  JSON = "application/json",
  XML = "application/xml",
  FORM = "application/x-www-form-urlencoded",
}
class HttpApiService<T> {

  protected getAll(endpoint: string, conf = {}): AxiosPromise<T[]> {
    return new Promise((resolve, reject) => {
      API.get<T[]>(`${endpoint}`, conf)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  protected get(endpoint: string, conf = {}): AxiosPromise<T> {
    return new Promise((resolve, reject) => {
      API.get<T>(`${endpoint}`, conf)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  protected create(endpoint: string, data: {}, conf = {}): AxiosPromise<T> {
    return this.post(endpoint, data, conf)
  }

  protected post(endpoint: string, data: {}, conf = {}): AxiosPromise<T> {
    return new Promise((resolve, reject) => {
      API.post<T>(`${endpoint}`, data, conf)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  protected update(endpoint: string, data: T, conf = {}): AxiosPromise<T> {
    return new Promise((resolve, reject) => {
      API.put<T>(`${endpoint}`, data, conf)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  protected delete(endpoint: string, id: any, conf = {}): AxiosPromise<T> {
    return new Promise((resolve, reject) => {
      API.delete<T>(`${endpoint}/${id}`, conf)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

export default HttpApiService;