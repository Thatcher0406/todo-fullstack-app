import axios from 'axios';
import { clearTokens, getAccessToken, getRefreshToken, setTokens, triggerLogout } from './session';

const API_BASE = 'https://your-render-app.onrender.com/api/';

const API = axios.create({
  baseURL: API_BASE,
});

let isRefreshing = false;
let pendingRequests = [];

const resolvePending = (token) => {
  pendingRequests.forEach((callback) => callback(token));
  pendingRequests = [];
};

API.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if (status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    const refresh = getRefreshToken();
    if (!refresh) {
      clearTokens();
      triggerLogout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(API(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshResponse = await axios.post(`${API_BASE}auth/token/refresh/`, {
        refresh,
      });

      const access = refreshResponse?.data?.access;
      if (!access) {
        throw new Error('Refresh token response did not include access token.');
      }

      setTokens({ access });
      resolvePending(access);

      originalRequest.headers.Authorization = `Bearer ${access}`;
      return API(originalRequest);
    } catch (refreshError) {
      clearTokens();
      triggerLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common.Authorization;
  }
};

export default API;
