import { StyleSheet, Text, View, ScrollView, Pressable, Alert,Platform } from 'react-native'
import React, { useEffect } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Header from '@/components/Header'
import {wp,hp} from '@/helper/common' 
import Avatar from '@/components/Avatar'
import { theme } from '@/constants/theme'
import Icon from '@/assets/icons'
import Input from '@/components/Input'
import {useState} from 'react'
import Button from '@/components/Button'
import { useUser } from '@/store/useUser'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import api from '@/services/api'
import { Toast } from '@ant-design/react-native';

const editProfile = () => {
  const router = useRouter();
  const user = useUser(state => state.user);
  const updateUser = useUser(state => state.updateUser);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    avatar: user?.Avatar || '',
    userName: user?.Username || '',
    phone: user?.Phone || '',
    signature: user?.Signature || ''
  });



  const pickImage = async () => {
    Alert.alert(
      "Change Avatar",
      "Choose a method",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Take Photo",
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Sorry, we need camera permissions to make this work!');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: 'images',
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
            });
            if (!result.canceled) {
                //上传到服务器后返回不依赖本地的永久URL并用此更新前端数据
              setFormData({...formData, avatar: result.assets[0].uri});
              
            }
          }
        },
        {
          text: "Choose from Library",
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: 'images',
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
            });
            if (!result.canceled) {
              setFormData({...formData, avatar: result.assets[0].uri});
              
            }
          }
        }
      ]
    );
  };

  const submit = async () => {    
    if(!formData.userName.trim()){
        Alert.alert("There should be a username")
        return
    }

    const data = new FormData();
    
    // 处理头像文件,变化了才上传，同时注意格式处理
    if (formData.avatar && formData.avatar !== user?.Avatar) {
        try {
            // 获取文件扩展名
            const fileExtension = formData.avatar.split('.').pop()?.toLowerCase() || 'jpg';
            const mimeType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
            
            // 创建文件对象
            const file = {
                uri: formData.avatar,
                type: mimeType,
                name: `avatar.${fileExtension}`
            };
            
            console.log('准备上传的文件:', file);
            data.append('avatar', file as any);
        } catch (error) {
            console.error('处理头像文件时出错:', error);
            Alert.alert("Error", "Failed to process avatar image");
            return;
        }
    }

    // 添加其他字段
    data.append('username', formData.userName);
    data.append('phone', formData.phone);
    data.append('signature', formData.signature);

    setLoading(true);
    try {
        console.log('发送更新请求...');
        console.log('表单数据:', {
            username: formData.userName,
            phone: formData.phone,
            signature: formData.signature
        });
        const response = await api.put('/updateUser', data);
        console.log('更新成功:', response.data);
        
        // 获取最新的用户信息
        const userResponse = await api.get('/getUserInfo');
        const newUserData = userResponse.data.userData;
        
        // 使用后端返回的新数据更新本地状态
        updateUser(newUserData);
        
        Toast.success('Profile updated successfully',1);
        router.back();
    } catch (error) {
        console.error('更新失败:', error);
        Alert.alert("Error", "Failed to update profile");
    } finally {
        setLoading(false);
    }
  }




  return (
    <ScreenWrapper bg="white">
        <View style={styles.container}>
            <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false}>
                <Header title="Edit Profile"/>

                <View style={styles.form}>
                    <View style={styles.avatarContainer}>
                        <Avatar
                        uri={formData.avatar}
                        size={hp(12)}
                        rounded={theme.radius.xxl*1.4}
                        />
                        <Pressable style={styles.cameraIcon} onPress={pickImage}>
                            <Icon name="camera" size={20} strokeWidth={2.5} color="black"/>
                        </Pressable>
                    </View> 
                    <Text style={{fontSize:hp(1.5),color:theme.colors.text}}>Please fill your profile details</Text>
                    <Input 
                        icon={<Icon name='user'/>}
                        placeholder="Enter your name"
                        value={formData.userName}
                        onChangeText={value => setFormData({...formData, userName: value})}
                    />
                    <Input 
                        icon={<Icon name='phone'/>}
                        placeholder="Enter your phone"
                        value={formData.phone}
                        onChangeText={value => setFormData({...formData, phone: value})}
                    />
                    <Input 
                        icon={<Icon name='signature'/>}
                        placeholder="Enter your signature"
                        value={formData.signature}
                        containerStyle={styles.signature}
                        onChangeText={value => setFormData({...formData, signature: value})}
                    />
                    <Button title="Update" loading={loading} onPress={submit}/>
                </View>
            </ScrollView>
        </View>
    </ScreenWrapper>
  )
}

export default editProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(4),
    },
    form: {
        gap: 20,
        marginTop: 20
    },
    avatarContainer: {
        height: hp(12),
        width: hp(12),
        alignSelf: 'center',
        marginBottom: 20
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: -12,
        padding: 7,
        borderRadius: 50,
        backgroundColor: theme.colors.textLight
    },
    signature: {
        height: hp(15),
        alignItems: 'flex-start'
    }
})