import React, { useEffect, useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';

const UpdateChecker = () => {
  const [isChecking, setIsChecking] = useState(false);

  const checkForUpdates = async () => {
    // 在开发环境中跳过更新检查
    if (__DEV__) {
      console.log('开发环境中跳过更新检查');
      return;
    }

    if (isChecking) return;
    
    try {
      setIsChecking(true);
      
      // 检查更新是否可用
      console.log('开始检查更新...');
      const update = await Updates.checkForUpdateAsync();
      console.log('更新检查结果:', update);
      
      if (update.isAvailable) {
        console.log('发现新版本，准备下载...');
        Alert.alert(
          '更新提示',
          '发现新版本，是否立即更新？',
          [
            {
              text: '稍后',
              style: 'cancel'
            },
            {
              text: '更新',
              onPress: async () => {
                try {
                  console.log('开始下载更新...');
                  await Updates.fetchUpdateAsync();
                  console.log('更新下载完成，准备重启...');
                  Alert.alert(
                    '更新完成',
                    '应用将重新启动以完成更新',
                    [
                      {
                        text: '确定',
                        onPress: async () => {
                          try {
                            console.log('开始重启应用...');
                            await Updates.reloadAsync();
                          } catch (error) {
                            console.error('重启应用失败:', error);
                            Alert.alert('重启失败', '请手动重启应用');
                          }
                        }
                      }
                    ]
                  );
                } catch (error) {
                  console.error('下载更新失败:', error);
                  Alert.alert('更新失败', '请检查网络连接后重试');
                }
              }
            }
          ]
        );
      } else {
        console.log('当前已是最新版本');
      }
    } catch (error) {
      console.error('检查更新失败:', error);
      // 添加更详细的错误信息
      if (error instanceof Error) {
        console.error('错误详情:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // 应用启动时检查更新
    checkForUpdates();

      // 每隔一段时间检查更新（设置为一天）
      const interval = setInterval(checkForUpdates, 24 * 60 * 60 * 1000);

      return () => clearInterval(interval);
    },[]);

  return null;
};

export default UpdateChecker; 