import { ScrollView, StyleSheet, Text, View,TouchableOpacity, Alert, Pressable } from 'react-native'
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
import {Post,createOrUpdatePost} from '@/services/postServices'
import {Video} from 'expo-av'

const newPost = () => {
  const user = useUser(state => state.user);
  const router = useRouter();
  
  // if (!user) {
  //   router.replace('/Login');
  //   return null;
  // }
  const editorRef = useRef(null);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<ImagePickerAsset | null>(null);
  const [postImages, setPostImages] = useState<string[]>([]);
  const [postVideos, setPostVideos] = useState<string[]>([]);
  
  const post: Post = {
    body: body,
    image: postImages,
    video: postVideos
  }

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
            if(isImage){
              if(postImages.length >= 10){
                Alert.alert(
                  "上传失败",
                  "最多上传10张图片",
                  [{ text: "确定", style: "default" }]
                );
                return
              }
              setPostImages([...postImages, result.assets[0].uri]);
            }else{
              if(postVideos.length >= 3){
                Alert.alert(
                  "上传失败",
                  "最多上传3个视频",
                  [{ text: "确定", style: "default" }]
                );
                return
              }
              setPostVideos([...postVideos, result.assets[0].uri]);
            }
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
            if(isImage){
              if(postImages.length >= 10){
                Alert.alert(
                  "上传失败",
                  "最多上传10张图片",
                  [{ text: "确定", style: "default" }]
                );
                return;
              }
              setPostImages([...postImages, result.assets[0].uri]);
            } else {
              if(postVideos.length >= 3){
                Alert.alert(
                  "上传失败",
                  "最多上传3个视频",
                  [{ text: "确定", style: "default" }]
                );
                return;
              }
              setPostVideos([...postVideos, result.assets[0].uri]);
            }
          }
        }
      }
    ];

    Alert.alert(
      isImage ? "上传图片" : "上传视频",
      "请选择上传方式",
      options
    );
  };

  const onSubmit=async ()=>{
    if(!body&&!file){
      Alert.alert('Post',"please choose an image/video or add post body")
      return
    }
    setLoading(true)
    //清空显示区域
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
                <Text style={styles.username}>{user?.userName || ''}</Text>
                <Text style={styles.publicText}>Public</Text>
              </View>
          </View>
          <View style={styles.textEditor}>
            <RichTextEditor editorRef={editorRef} onChange={text => setBody(text)}/>
          </View>

          {
            file&&(
              <View style={styles.file}>
                  <Pressable style={styles.closeIcon}>
                    <Icon name="delete" size={20} color="black"/>
                  </Pressable>
              </View>
            )
          }
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
          loading={loading}
          hasShadow={false}
          onPress={onSubmit}/>

      </View>
    </ScreenWrapper>
  )
}

export default newPost

const styles = StyleSheet.create({
  container:{
    flex: 1,
    padding: 16
  },
  header:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  username: {
    fontSize: hp(1.8),
    fontWeight: '600',
    color: theme.colors.dark
  },
  textEditor: {
    minHeight: hp(15)
  },
  addImageText: {
    fontSize: hp(1.8),
    fontWeight: '500',
    color: theme.colors.dark
  },
  mediaIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
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
  },
  file:{
    height:hp(30),
    width:'100%',
    borderRadius:theme.radius.md,
    overflow:'hidden',
    borderCurve:'continuous',
  },
  video:{

  },
  closeIcon:{
    position:'absolute',
    top:10,
    right:10,
    padding:5,
    borderRadius:'50%',
  }
})


// import React, { useState, useRef } from 'react';
// import { SafeAreaView, StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
// import { WebView, WebViewMessageEvent } from 'react-native-webview';

// const NewPost = () => {
//   const webViewRef = useRef<WebView>(null);
//   const [content, setContent] = useState('');

//   const editorInitialContent = `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <meta charset="utf-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
//         <style>
//           body {
//             font-family: -apple-system, system-ui;
//             margin: 16px;
//             padding: 0;
//           }
//           .editor {
//             min-height: 200px;
//             padding: 10px;
//             border: 1px solid #ccc;
//             border-radius: 4px;
//             outline: none;
//           }
//           .toolbar {
//             padding: 8px;
//             background: #f5f5f5;
//             border-bottom: 1px solid #ddd;
//             display: flex;
//             flex-wrap: wrap;
//             gap: 8px;
//           }
//           .toolbar button {
//             padding: 4px 8px;
//             background: white;
//             border: 1px solid #ddd;
//             border-radius: 4px;
//             cursor: pointer;
//             min-width: 32px;
//           }
//           .toolbar button:active {
//             background: #eee;
//           }
//           .toolbar select {
//             padding: 4px;
//             border: 1px solid #ddd;
//             border-radius: 4px;
//             background: white;
//           }
//           .color-button {
//             width: 24px;
//             height: 24px;
//             border-radius: 12px;
//             border: 1px solid #ddd;
//             padding: 0;
//           }
//           .editor img {
//             max-width: 100%;
//             height: auto;
//           }
//           .editor blockquote {
//             margin: 10px 0;
//             padding: 10px;
//             border-left: 4px solid #ddd;
//             background: #f9f9f9;
//           }
//           .editor pre {
//             background: #f5f5f5;
//             padding: 10px;
//             border-radius: 4px;
//             overflow-x: auto;
//           }
//         </style>
//         <script>
//           function execCommand(command, value = null) {
//             document.execCommand(command, false, value);
//             updateContent();
//           }
          
//           function getContent() {
//             return document.querySelector('.editor').innerHTML;
//           }

//           function setContent(html) {
//             document.querySelector('.editor').innerHTML = html;
//           }

//           function updateContent() {
//             window.ReactNativeWebView.postMessage(JSON.stringify({
//               type: 'content',
//               content: getContent()
//             }));
//           }

//           function insertLink() {
//             window.ReactNativeWebView.postMessage(JSON.stringify({
//               type: 'requestLink'
//             }));
//           }

//           function setFontSize(size) {
//             document.execCommand('fontSize', false, size);
//           }

//           function setTextColor(color) {
//             document.execCommand('foreColor', false, color);
//           }

//           function setBackgroundColor(color) {
//             document.execCommand('hiliteColor', false, color);
//           }

//           function insertCode() {
//             const selection = window.getSelection();
//             const range = selection.getRangeAt(0);
//             const pre = document.createElement('pre');
//             pre.textContent = selection.toString() || '在这里输入代码';
//             range.deleteContents();
//             range.insertNode(pre);
//             updateContent();
//           }

//           document.addEventListener('DOMContentLoaded', function() {
//             const editor = document.querySelector('.editor');
//             editor.addEventListener('input', updateContent);
//             editor.addEventListener('keydown', function(e) {
//               if (e.key === 'Tab') {
//                 e.preventDefault();
//                 document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
//               }
//             });
//           });
//         </script>
//       </head>
//       <body>
//         <div class="toolbar">
//           <select onchange="setFontSize(this.value)">
//             <option value="3">默认大小</option>
//             <option value="1">小</option>
//             <option value="2">中</option>
//             <option value="4">大</option>
//             <option value="5">特大</option>
//           </select>
//           <button onclick="execCommand('bold')"><b>B</b></button>
//           <button onclick="execCommand('italic')"><i>I</i></button>
//           <button onclick="execCommand('underline')"><u>U</u></button>
//           <button onclick="execCommand('strikeThrough')"><s>S</s></button>
//           <button onclick="execCommand('justifyLeft')">←</button>
//           <button onclick="execCommand('justifyCenter')">↔</button>
//           <button onclick="execCommand('justifyRight')">→</button>
//           <button onclick="execCommand('insertUnorderedList')">•</button>
//           <button onclick="execCommand('insertOrderedList')">1.</button>
//           <button onclick="execCommand('indent')">→|</button>
//           <button onclick="execCommand('outdent')">|←</button>
//           <button onclick="insertLink()">🔗</button>
//           <button onclick="execCommand('undo')">↩</button>
//           <button onclick="execCommand('redo')">↪</button>
//           <button onclick="insertCode()">{ }</button>
//           <button onclick="execCommand('insertHTML', '<blockquote>引用文字</blockquote>')">『』</button>
//           <button class="color-button" style="background: #000" onclick="setTextColor('#000')"></button>
//           <button class="color-button" style="background: #F00" onclick="setTextColor('#F00')"></button>
//           <button class="color-button" style="background: #0F0" onclick="setTextColor('#0F0')"></button>
//           <button class="color-button" style="background: #00F" onclick="setTextColor('#00F')"></button>
//           <button class="color-button" style="background: yellow" onclick="setBackgroundColor('yellow')"></button>
//         </div>
//         <div class="editor" contenteditable="true"></div>
//       </body>
//     </html>
//   `;

//   const onMessage = (event: WebViewMessageEvent) => {
//     try {
//       const data = JSON.parse(event.nativeEvent.data);
//       if (data.type === 'content') {
//         setContent(data.content);
//       } else if (data.type === 'requestLink') {
//         Alert.prompt(
//           '插入链接',
//           '请输入链接地址',
//           [
//             {
//               text: '取消',
//               style: 'cancel'
//             },
//             {
//               text: '确定',
//               onPress: url => {
//                 if (url) {
//                   webViewRef.current?.injectJavaScript(`
//                     execCommand('createLink', '${url}');
//                     true;
//                   `);
//                 }
//               }
//             }
//           ],
//           'plain-text',
//           'https://'
//         );
//       }
//     } catch (e) {
//       console.error('Error parsing message:', e);
//     }
//   };

//   const insertImage = async () => {
//     // 这里应该实现图片选择和上传逻辑
//     Alert.alert('提示', '这里需要实现图片选择和上传功能');
//     // 示例：
//     const imageUrl = 'https://example.com/image.jpg';
//     webViewRef.current?.injectJavaScript(`
//       execCommand('insertImage', '${imageUrl}');
//       true;
//     `);
//   };

//   const saveContent = () => {
//     Alert.alert('保存内容', '内容已保存到状态中，实际应用中这里应该保存到后端', [
//       {
//         text: '查看HTML',
//         onPress: () => console.log('HTML内容:', content)
//       },
//       {
//         text: '确定',
//         style: 'cancel'
//       }
//     ]);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.nativeToolbar}>
//         <TouchableOpacity style={styles.button} onPress={insertImage}>
//           <Text>插入图片</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button} onPress={saveContent}>
//           <Text>保存</Text>
//         </TouchableOpacity>
//       </View>
//       <WebView
//         ref={webViewRef}
//         source={{ html: editorInitialContent }}
//         style={styles.editor}
//         scrollEnabled={true}
//         hideKeyboardAccessoryView={true}
//         keyboardDisplayRequiresUserAction={false}
//         onMessage={onMessage}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   editor: {
//     flex: 1,
//     backgroundColor: '#F5FCFF',
//   },
//   nativeToolbar: {
//     flexDirection: 'row',
//     padding: 8,
//     backgroundColor: '#f5f5f5',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   button: {
//     padding: 8,
//     backgroundColor: 'white',
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     marginRight: 8,
//   }
// });

// export default NewPost;
