import axios from 'axios';

// 创建axios实例
const api = axios.create({
//   baseURL: 'https://your-api-base-url.com', // 设置基础URL
  baseURL: 'http://10.0.2.2:8080/api/v1', // Android 模拟器
  // 或
  // baseURL: 'http://localhost:8080', // iOS 模拟器
  timeout: 10000, // 超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 可以在这里统一添加token
    const token = ''; // 从存储中获取token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
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