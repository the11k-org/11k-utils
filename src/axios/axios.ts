import { AsyncLocalStorage } from 'async_hooks';
import axios, { AxiosHeaders, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';

const asyncLocalStorage = new AsyncLocalStorage<{ tracingId: string }>();

export class AxiosWrapper {
    private axiosInstance: AxiosInstance;
  
    constructor() {
      this.axiosInstance = axios.create();
      this.axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const tracingId = asyncLocalStorage.getStore()?.tracingId || uuidv4();
        if (!config.headers) {
            config.headers = new AxiosHeaders();
          }
          config.headers['X-Tracing-ID'] = tracingId;
        return config;
      });
    }
  
    public get instance(): AxiosInstance {
      return this.axiosInstance;
    }
  }