// plugins/axios.client.ts

import axios, {
    type AxiosResponse,
    type InternalAxiosRequestConfig,
    AxiosHeaders
} from 'axios';

const axiosInstance = axios.create();

if (typeof window !== 'undefined') {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (!metaTag) {
        throw new Error("CSRF token meta tag not found");
    }
    const token = metaTag.getAttribute('content');
    if (!token) {
        throw new Error("CSRF token not found in meta tag");
    }
    axiosInstance.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

// ************ Abort controller ************
const abortControllerMap = new Map<string, AbortController>();

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
        if (typeof window !== 'undefined') {
            if (!config.headers) {
                config.headers = AxiosHeaders.from({});
            }

            const metaTag = document.querySelector('meta[name="csrf-token"]');
            const token = metaTag ? metaTag.getAttribute('content') : '';
            config.headers['X-CSRF-TOKEN'] = token;

            const method = config.method ? config.method.toLowerCase() : 'get';
            const url = config.url || '';
            const requestKey = `${method}:${url}`;

            if (abortControllerMap.has(requestKey)) {
                abortControllerMap.get(requestKey)?.abort();
            }
            const controller = new AbortController();
            config.signal = controller.signal;
            abortControllerMap.set(requestKey, controller);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        if (typeof window !== 'undefined') {
            const method = response.config.method ? response.config.method.toLowerCase() : 'get';
            const url = response.config.url || '';
            const requestKey = `${method}:${url}`;
            abortControllerMap.delete(requestKey);
        }
        return response;
    },
    (error) => {
        if (axios.isCancel(error)) {
            console.log('Request canceled', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
