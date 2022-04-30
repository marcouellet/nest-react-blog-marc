import axios, { AxiosInstance, AxiosPromise, AxiosResponse } from 'axios';
import { useAuth0 } from '../../contexts/auth0-context';

export enum EnumContentType {
  JSON = "application/json",
  XML = "application/xml",
  FORM = "application/x-www-form-urlencoded",
}

class HttpApiService<T> {
  private _axiosInstance: AxiosInstance | undefined;
  private _baseURL: string;
  private _token: string | null;

  constructor(baseURL: string ) {

    this._baseURL = baseURL;
    this._token = null;

    this.createAxiosInstance();
  }

  private defaultOptions = (): any => {
    // Set the AUTH token for any request

    const authHttpHeader = "Bearer token" // Token goes here
    this._token = authHttpHeader;

    const options = {
      baseURL: this._baseURL,
      // withCredentials: true, // Window Authentification
      headers: {
        'Accept': 'application/json',
        // 'Authorization': `${authHttpHeader}` // OAuth Authetification
      }
    };
    return options;
  };

  /**
   * Create instance
   */
  private createAxiosInstance() {
    this._axiosInstance = axios.create(this.defaultOptions());

    // this.checkAutorization()

    // Add a request interceptor
    this._axiosInstance.interceptors.request.use(
      config => config,
      error => {
        return Promise.reject(error);
      }
    );

    // Add a response interceptor
    this._axiosInstance.interceptors.response.use(
      this.handleSuccess,
      this.handleError
    );
  }

  protected getToken() {
    return this._token;
  }

  protected getAll(endpoint: string, conf = {}): AxiosPromise<T[]> {
    return new Promise((resolve, reject) => {
      this._axiosInstance!
        .get<T[]>(`${endpoint}`, conf)
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
      this._axiosInstance!
        .get<T>(`${endpoint}`, conf)
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
      this._axiosInstance!
        .post<T>(`${endpoint}`, data, conf)
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
      this._axiosInstance!
        .put<T>(`${endpoint}`, data, conf)
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
      this._axiosInstance!
        .delete<T>(`${endpoint}/${id}`, conf)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  handleSuccess(response: AxiosResponse) {
    // console.log('handleSuccess' + JSON.stringify(response))
    return response;
  }

  handleError = (err: any) => {
    console.log(`HttpService::Error : ${err}`)
    if (!err.response) {
        console.log(`Network error: ${err}`);
    } else {
      if (err.response !== undefined) {
        const { status } = err.response;
        if (status === 401 || status === 500) {
          console.log(`HttpService::Error(401 or 500) : ${err.response.data.Message}`)
        }
      }
    }
    return Promise.reject(err);
  };

  redirectTo = (document: any, path: string) => {
    document.location = path;
  };
}

export default HttpApiService;