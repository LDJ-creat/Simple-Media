import { Platform } from 'react-native';

export const API_BASE_URL = __DEV__ 
  ? Platform.select({
      ios: 'http://localhost:8080/api/media/v1',
      android: 'http://10.0.2.2:8080/api/media/v1',
    })
  : 'http://8.134.110.79/api/media/v1';  // 替换为你的生产环境服务器地址

export const getFullUrl = (path: string) => {
  // 如果路径已经是完整的 URL，直接返回
  if (path.startsWith('http')) {
    return path;
  }
  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}; 