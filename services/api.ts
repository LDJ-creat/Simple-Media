import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// 创建axios实例
const api = axios.create({
//   baseURL: 'https://your-api-base-url.com', // 设置基础URL
  // baseURL: 'http://10.0.2.2:8080/api/v1', // Android 模拟器
  // 或
  // baseURL: 'http://localhost:8080', // iOS 模拟器
  baseURL: 'http://8.134.110.79:8081/api/v1', // 服务器
  timeout: 10000, // 超时时间
});

// 请求拦截器
api.interceptors.request.use(
  async config => {
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
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    console.log('收到响应:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  error => {
    console.error('响应拦截器错误:', {
      message: error.message,
      response: error.response,
      request: error.request
    });
    // 统一错误处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 处理未授权
          break;
        case 404:
          // 处理未找到
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default api;