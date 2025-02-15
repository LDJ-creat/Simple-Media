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

const editProfile = () => {
  const router = useRouter();
  const user = useUser(state => state.user);
  const updateUser = useUser(state => state.updateUser);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    avatar: user?.avatar || '',
    userName: user?.userName || '',
    phone: user?.phone || '',
    signature: user?.signature || ''
  });

//   useEffect(() => {
//     (async () => {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Sorry, we need camera roll permissions to make this work!');
//       }
//     })();
//   }, []);

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
    setLoading(true);
    try {
      // 调用API更新用户信息
      const data = new FormData();
      data.append('avatar', {
        uri: formData.avatar,
        type: 'image/jpeg',
        name: 'avatar.jpg'
      } as any);

      
      // 更新本地状态
      updateUser(formData);
      Alert.alert("Success", "Profile updated successfully");
      router.back();
    } catch (error) {
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