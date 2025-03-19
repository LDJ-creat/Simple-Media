import React, { useState, useRef,useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Text, Alert, Image, ActivityIndicator } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import Header from '@/components/Header'
import Button from '@/components/Button'
import {Post,createPost,updatePost,mediaData,getPost} from '@/services/postServices'
import {useRouter,useLocalSearchParams} from  'expo-router'
import { useUser } from '@/store/useUser'
import * as ImagePicker from 'expo-image-picker'
import { hp,wp } from '@/helper/common'
import Icon from '@/assets/icons'
import {theme} from '@/constants/theme'
import Avatar from '@/components/Avatar';
import { FlatList } from 'react-native-gesture-handler';
import { Video, ResizeMode } from 'expo-av';
import useMyPosts from '@/store/useMyPosts'
import { userData } from '@/services/getUserData';

const NewPost = () => {
  const [loading,setLoading]=useState(false)
  const user = useUser(state => state.user);
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<mediaData[]>([]);
  const params = useLocalSearchParams();
  const editPost = params.post ? JSON.parse(decodeURIComponent(params.post as string)) : null;
  const addMyPosts = useMyPosts(state => state.addMyPosts)
  const updateMyPosts = useMyPosts(state => state.updateMyPosts)
  const [webViewLoaded, setWebViewLoaded] = useState(false);
  

  useEffect(()=>{
    if(editPost && webViewLoaded){
      console.log("editPost:",editPost)
      setContent(editPost.Content || '')
      setMedia(editPost.Media || [])
      
      // 注入原内容到WebView
      webViewRef.current?.injectJavaScript(`
        setContent(\`${editPost.Content.replace(/`/g, '\\`') || ''}\`);
        true;
      `);
    }
  },[webViewLoaded])

  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'content') {
        setContent(data.content);
      } else if (data.type === 'requestLink') {
        Alert.prompt(
          '插入链接',
          '请输入链接地址',
          [
            {
              text: '取消',
              style: 'cancel'
            },
            {
              text: '确定',
              onPress: url => {
                if (url) {
                  webViewRef.current?.injectJavaScript(`
                    execCommand('createLink', '${url}');
                    true;
                  `);
                }
              }
            }
          ],
          'plain-text',
          'https://'
        );
      }
    } catch (e) {
      console.error('Error parsing message:', e);
    }
  };

  const post: Post = {
    content: content,
    media: media,
    postID: editPost?.ID
  }


  const onSubmit=async ()=>{
    if(!content && media.length===0){
      Alert.alert('Post',"please add post content or choose an image/video")
      return
    }
    const myPost:getPost={
      ID: editPost?.ID || 0,
      User: user as userData,
      Content: content,
      LikeCount: editPost?.LikeCount || [],
      Media: media,
      Comment: editPost?.Comment || [],
      CreatedAt: editPost?.CreatedAt || new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
      DeletedAt: null,
      UserID: user?.ID as unknown as number,
    }

    if(editPost){
      await updatePost(post)
      updateMyPosts(myPost)
    }else{
      const response=await createPost(post)
      myPost.ID=response.postID
      addMyPosts(myPost)
    }

    setLoading(true)
    //清空显示区域
    setContent('')  
    setMedia([])
    setLoading(false)
    router.navigate({pathname:'/home'})

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
              if(media.length >= 10){
                Alert.alert(
                  "上传失败",
                  "最多上传10张图片或视频",
                  [{ text: "确定", style: "default" }]
                );
                return
              }
              const newMedia = result.assets.map(asset => ({
                ID: '',
                Uri: asset.uri,
                Name: asset.fileName || `${Date.now()}.${isImage ? 'jpg' : 'mp4'}`,
                Type: isImage ? 'image' : 'video'
              }));
              setMedia([...media, ...newMedia]);

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
            if(media.length >= 10){
              Alert.alert(
                "上传失败",
                "最多上传10张图片或视频",
                [{ text: "确定", style: "default" }]
              );
              return;
            }
            const newMedia = result.assets.map(asset => ({
              ID: '',
              Uri: asset.uri,
              Name: asset.fileName || `${Date.now()}.${isImage ? 'jpg' : 'mp4'}`,
              Type: isImage ? 'image' : 'video'
            }));
            setMedia([...media, ...newMedia]);
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

  const editorInitialContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          body {
            font-family: -apple-system, system-ui;
            margin: 0;
            padding: 0;
          }
          .editor-container {
            position: relative;
            height: 100%;
          }
          .toolbar {
            position: sticky;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            padding: 8px;
            background: #f5f5f5;
            border-bottom: 1px solid #ddd;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
          .editor {
            padding: 16px;
            min-height: calc(100% - 50px);
            border-radius: 12px;
            min-height: 100px;
          }
          .toolbar button {
            padding: 4px 8px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            min-width: 32px;
          }
          .toolbar button:active {
            background: #eee;
          }
          .toolbar select {
            padding: 4px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: white;
          }
          .color-button {
            width: 24px;
            height: 24px;
            border-radius: 12px;
            border: 1px solid #ddd;
            padding: 0;
          }
          .editor img {
            max-width: 100%;
            height: auto;
          }
          .editor blockquote {
            margin: 10px 0;
            padding: 10px;
            border-left: 4px solid #ddd;
            background: #f9f9f9;
          }
          .editor pre {
            background: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            overflow-x: auto;
          }
        </style>
        <script>
          function execCommand(command, value = null) {
            document.execCommand(command, false, value);
            updateContent();
          }
          
          function getContent() {
            return document.querySelector('.editor').innerHTML;
          }

          function setContent(html) {
            document.querySelector('.editor').innerHTML = html;
          }

          function updateContent() {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'content',
              content: getContent()
            }));
          }

          function insertLink() {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'requestLink'
            }));
          }

          function setFontSize(size) {
            document.execCommand('fontSize', false, size);
          }

          function setTextColor(color) {
            document.execCommand('foreColor', false, color);
          }

          function setBackgroundColor(color) {
            document.execCommand('hiliteColor', false, color);
          }

          function insertCode() {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const pre = document.createElement('pre');
            pre.textContent = selection.toString() || '在这里输入代码';
            range.deleteContents();
            range.insertNode(pre);
            updateContent();
          }

          document.addEventListener('DOMContentLoaded', function() {
            const editor = document.querySelector('.editor');
            editor.addEventListener('input', updateContent);
            editor.addEventListener('keydown', function(e) {
              if (e.key === 'Tab') {
                e.preventDefault();
                document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
              }
            });
          });
        </script>
      </head>
      <body>
        <div class="editor-container">
          <div class="toolbar">
            <button onclick="setFontSize('26px')">H1</button>
            <button onclick="setFontSize('17px')">H2</button>
            <button onclick="execCommand('bold')"><b>B</b></button>
            <button onclick="execCommand('italic')"><i>I</i></button>
            <button onclick="execCommand('underline')"><u>U</u></button>
            <button onclick="execCommand('strikeThrough')"><s>S</s></button>
            <button onclick="execCommand('justifyLeft')">←</button>
            <button onclick="execCommand('justifyCenter')">↔</button>
            <button onclick="execCommand('justifyRight')">→</button>
            <button onclick="execCommand('insertUnorderedList')">•</button>
            <button onclick="execCommand('insertOrderedList')">1.</button>
            <button onclick="execCommand('indent')">→|</button>
            <button onclick="execCommand('outdent')">|←</button>
            <button onclick="execCommand('undo')">↩</button>
            <button onclick="execCommand('redo')">↪</button>
            <button onclick="insertCode()">{ }</button>
          </div>
          <div class="editor" contenteditable="true"></div>
        </div>
      </body>
    </html>
  `;

  const renderMediaItem = ({ item }: { item: mediaData }) => {
    const isVideo = item.Uri.includes('.mp4') || item.Uri.includes('.mov') || item.Uri.includes('VID');

    return (
      <View style={styles.mediaPreviewContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
             setMedia(media.filter(m=>m.ID!==item.ID))
          }}
        >
          <Icon name="delete" size={16} />
        </TouchableOpacity>
        
        {isVideo ? (
          <Video
            source={{ uri: item.Uri }}
            style={styles.mediaPreview}
            resizeMode={ResizeMode.COVER} 
            isLooping
            isMuted={true}  
            shouldPlay={false}
          />
        ) : (
          <Image
            source={{ uri: item.Uri }}
            style={styles.mediaPreview}
            resizeMode="cover"
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Create Post" showBackButton={true}/>
      <View style={styles.content}>
        <View style={styles.header}>
          <Avatar size={40} uri={user?.Avatar || ''}/>
          <View>
            <Text style={styles.username}>{user?.Username || 'Hello'}</Text>
            <Text style={styles.publicText}>Public</Text>
          </View>
        </View>
        <View style={styles.editorContainer}>
          <WebView
            ref={webViewRef}
            source={{ html: editorInitialContent }}
            style={styles.editor}
            scrollEnabled={true}
            hideKeyboardAccessoryView={true}
            keyboardDisplayRequiresUserAction={false}
            onMessage={onMessage}
            onLoadEnd={() => setWebViewLoaded(true)}
          />
          {!webViewLoaded && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          )}
        </View>

        {media.length > 0 && (
          <FlatList
            data={media}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(index) =>index.toString()}
            renderItem={renderMediaItem}
            style={styles.mediaList}
            contentContainerStyle={styles.mediaListContent}
          />
        )}

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
      </View>
      <Button
        buttonStyle={{
          height: hp(6.2),
          width: wp(90),
          alignSelf: 'center',
          marginBottom:10,
        }}
        title={editPost?'Update':'Post'}
        loading={loading}
        hasShadow={false}
        onPress={onSubmit}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    gap: 20,
  },
  editorContainer: {
    position: 'relative',
    height: hp(60),
  },
  editor: {
    height: hp(60),
    backgroundColor: 'white',
    marginBottom: 10,
  },
  mediaList: {
    // maxHeight: hp(15),
    height: hp(30),

  },
  mediaListContent: {
    paddingHorizontal: 10,
  },
  mediaPreviewContainer: {
    position: 'relative',
    marginRight: 10,
  },
  mediaPreview: {
    width: wp(30),
    height: wp(30),
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.gray,
  },
  deleteButton: {
    position: 'absolute',
    top: 1,
    right: -5,
    zIndex: 1,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom:10,
  },
  mediaIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },
  addImageText: {
    fontSize: hp(1.8),
    fontWeight: '500',
    color: theme.colors.dark
  },
  header:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft:10,
  },
  username: {
    fontSize: hp(1.8),
    fontWeight: '600',
    color: theme.colors.dark
  },
  publicText:{
    fontSize:hp(1.7),
    fontWeight:'500',
    color:theme.colors.textLight
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default NewPost;


