import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/config/api';
import { router } from 'expo-router';

console.log('API Base URL:', API_BASE_URL);

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 超时时间
});

// 请求拦截器
api.interceptors.request.use(
  async config => {
    console.log('发送请求:', config.url);
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 处理 FormData
    if (config.data instanceof FormData) {
      // 显式设置 Content-Type 为 multipart/form-data
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    console.log('发送请求:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });

    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    console.log('收到响应:', response.status, response.data);
    return response;
  },
  error => {
    console.error('响应错误:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    // 统一错误处理
    if (error.response) {
      if (error.response.status === 401) {
        // Token 过期或无效，清除本地存储并重定向到登录页面
        AsyncStorage.removeItem('token');
        router.push('/Login');
        // 可以在这里添加重定向到登录页面的逻辑
      } else if (error.response.status === 404) {
        // 处理未找到
        console.log('未找到');
      }
    }
    return Promise.reject(error);
  }
);

export default api;