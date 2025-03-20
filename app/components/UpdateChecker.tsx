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
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
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
                  await Updates.fetchUpdateAsync();
                  Alert.alert(
                    '更新完成',
                    '应用将重新启动以完成更新',
                    [
                      {
                        text: '确定',
                        onPress: async () => {
                          await Updates.reloadAsync();
                        }
                      }
                    ]
                  );
                } catch (error) {
                  Alert.alert('更新失败', '请检查网络连接后重试');
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('检查更新失败:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // 只在生产环境中检查更新
    if (!__DEV__) {
      // 应用启动时检查更新
      checkForUpdates();

      // 每隔一段时间检查更新（设置为一天）
      const interval = setInterval(checkForUpdates, 24 * 60 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, []);

  return null;
};

export default UpdateChecker; 