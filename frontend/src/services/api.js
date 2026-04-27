import axios from 'axios';

// Mantém a API relativa quando o app está atrás do Nginx, mas ainda aceita URL absoluta em outros ambientes.
const configuredBaseUrl = process.env.REACT_APP_API_URL || '/api';
const normalizedBaseUrl = configuredBaseUrl.endsWith('/')
  ? configuredBaseUrl.slice(0, -1)
  : configuredBaseUrl;

const browserOrigin = typeof window !== 'undefined' ? window.location.origin : '';
const isAbsoluteUrl = /^https?:\/\//i.test(normalizedBaseUrl);
const publicBaseUrl = isAbsoluteUrl
  ? new URL(normalizedBaseUrl).origin
  : browserOrigin;

const api = axios.create({
  baseURL: normalizedBaseUrl,
});

let isRefreshing = false;
let failedQueue = [];

// Reexecuta as requisições que falharam por 401 assim que um novo token é emitido.
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config, response } = error;
    const originalRequest = config;

    if (response && response.status === 401 && !originalRequest._retry) {
      // Evita múltiplos refresh em paralelo quando várias chamadas expiram ao mesmo tempo.
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      return new Promise((resolve, reject) => {
        api.post('/refresh', { refreshToken })
          .then(({ data }) => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            
            api.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
            originalRequest.headers['Authorization'] = 'Bearer ' + data.token;
            
            processQueue(null, data.token);
            resolve(api(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            window.dispatchEvent(new CustomEvent('unauthorized'));
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }
    return Promise.reject(error);
  }
);

export const SOCKET_URL = publicBaseUrl;
// Uploads são servidos fora de /api, então usamos apenas a origem pública da aplicação.
export const buildUploadUrl = (filename) => `${publicBaseUrl}/uploads/${filename}`;

export default api;
