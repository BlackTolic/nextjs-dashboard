import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Logger from '../lib/utils/logger';

const defaultOnReqFullfilled = (config: InternalAxiosRequestConfig) => {
  Logger.info(`请求地址: ${JSON.stringify(config.url)}`);
  return config;
};

const defaultOnReqRejected = (error: AxiosError) => {
  return Promise.reject(error);
};

const defaultOnResFullfilled = (response: AxiosResponse) => {
  Logger.info(`响应数据: ${JSON.stringify(response.data)}`);
  return response.data;
};

const defaultOnResRejected = (error: AxiosError) => {
  return Promise.reject(error);
};

const defaultConfig = {
  baseURL: '/',
  timeout: 60 * 1000 * 5 // 超时时间
};

class Request {
  private axios: AxiosInstance;
  constructor({
    config = {},
    onReqFullfilled = defaultOnReqFullfilled,
    onReqRejected = defaultOnReqRejected,
    onResFullfilled = defaultOnResFullfilled,
    onResRejected = defaultOnResRejected
  }) {
    this.axios = axios.create(Object.assign({}, defaultConfig, config));
    this.axios.interceptors.request.use(onReqFullfilled, onReqRejected);
    this.axios.interceptors.response.use(onResFullfilled, onResRejected);
  }

  get<T>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
    return this.axios.get(url, config);
  }

  post<T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> {
    return this.axios.post(url, data, config);
  }
}

const request = new Request({});
export default request;
