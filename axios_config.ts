// axios_config.ts

import axios, {
    type AxiosResponse,
    type InternalAxiosRequestConfig,
    AxiosHeaders
} from 'axios';

const abortControllerMap = new Map<string, AbortController>();

axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
        if (!config.headers) {
            config.headers = AxiosHeaders.from({});
        }

        const method = config.method ? config.method.toLowerCase() : 'get';
        const url = config.url || '';
        const requestKey = `${method}:${url}`;

        if (abortControllerMap.has(requestKey)) {
            abortControllerMap.get(requestKey)?.abort();
        }

        const controller = new AbortController();
        config.signal = controller.signal;
        abortControllerMap.set(requestKey, controller);

        return config;
    },
    (error) => Promise.reject(error)
);

axios.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        const method = response.config.method ? response.config.method.toLowerCase() : 'get';
        const url = response.config.url || '';
        const requestKey = `${method}:${url}`;
        abortControllerMap.delete(requestKey);
        return response;
    },
    (error) => {
        if (axios.isCancel(error)) {
            console.log('Request canceled', error.message);
        }
        return Promise.reject(error);
    }
);

export default axios;
