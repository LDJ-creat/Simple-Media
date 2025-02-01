import { ScrollView, StyleSheet, Text, View,TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Header from '@/components/Header'
import Avatar from '@/components/Avatar'
import { useUser } from '@/store/useUser'
import { hp } from '@/helper/common'
import {theme} from '@/constants/theme'
import{useRouter} from 'expo-router'
import {useState,useRef} from "react"
import RichTextEditor from '@/components/RichTextEditor'
import Icon from '@/assets/icons'
import Button from '@/components/Button'
import * as ImagePicker from 'expo-image-picker'
import { ImagePickerAsset } from 'expo-image-picker'

const newPost = () => {
  const user = useUser(state => state.user);
  const router=useRouter();
  const editorRef=useRef(null);
  const bodyRef=useRef("");
  const[loading,setLoading]=useState(false);
  const [file, setFile] = useState<ImagePickerAsset | null>(null);

  const onPick = async (isImage: boolean) => {
    const options = [
      {
        text: "取消",
        style: "cancel" as const
      },
      {
        text: isImage ? "拍照" : "录制视频",
        style: "default" as const,
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('需要相机权限');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: isImage ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
            videoMaxDuration: 60,
          });
          if (!result.canceled) {
            setFile(result.assets[0]);
          }
        }
      },
      {
        text: `从${isImage ? "相册" : "视频库"}选择`,
        style: "default" as const,
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: isImage ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
            videoMaxDuration: 60,
          });
          if (!result.canceled) {
            setFile(result.assets[0]);
          }
        }
      }
    ];

    Alert.alert(
      "上传媒体",
      "请选择上传方式",
      options
    );
  };

  const onSubmit=()=>{
    
  }
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <Header title="Create Post"/>
        <ScrollView contentContainerStyle={{gap:20}}>
          <View style={styles.header}>
            <Avatar
              uri={user?.avatar||''}
              size={hp(6.5)}
              rounded={theme.radius.xl}
              />
              <View style={{gap:2}}>
                <Text style={styles.username}>{user.userName||''}</Text>
                <Text style={styles.publicText}>Public</Text>
              </View>
          </View>
          <View  style={styles.textEditor}>
            <RichTextEditor editorRef={editorRef} onChange={body=>bodyRef.current=body}/>
          </View>

          <View style={styles.media}>
            <Text style={styles.addImageText}>Add to your post</Text>
            <View style={styles.mediaIcons}>
              <TouchableOpacity onPress={() => onPick(true)}>
                <Icon name="Image" size={30} color={theme.colors.dark}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPick(false)}>
                <Icon name="video" size={33} color={theme.colors.dark}/>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Button
          buttonStyle={{height:hp(6.2)}}
          title='Post'
          loading={false}
          hasShadow={false}
          onPress={onSubmit}/>

      </View>
    </ScreenWrapper>
  )
}

export default newPost

const styles = StyleSheet.create({
  container:{

  },
  header:{

  },
  publicText:{
    fontSize:hp(1.7),
    fontWeight:'500',
    color:theme.colors.textLight
  },
  media:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems: 'center',
    borderWidth:1.5,
    padding:12,
    paddingHorizontal:18,
    borderRadius:theme.radius.xl,
    borderCurve:'continuous',
    borderColor:theme.colors.gray,
  },
  mediaIcon:{
    flexDirection:'row',
    alignItems:'center',
    gap:15,
  }
})