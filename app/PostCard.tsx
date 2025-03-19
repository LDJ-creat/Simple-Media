import { StyleSheet, Text, TouchableOpacity, View, Image, FlatList, Alert, Share as RNShare, Platform, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import {theme} from '@/constants/theme'
import {hp,wp} from '@/helper/common'
import Avatar from '@/components/Avatar'
import {getPost,createPostLike,removePostLike} from "@/services/postServices"
import moment from "moment"
import Icon from  '@/assets/icons'
import RenderHtml from "react-native-render-html"
import { Video,ResizeMode } from 'expo-av'
import { useUser } from '@/store/useUser'
import { stripHtmlTags } from '@/helper/common'
import ImageView from 'react-native-image-viewing'
import VideoPlayer from '@/app/components/VideoPlayer'

interface PostCardProps {
    item?: getPost;
    router: any;
    hasShadow?: boolean;
    showMoreIcons?: boolean;
    commentsCount?:number;
    showDelete?:boolean,
    onDeletePost?:()=>void,
    onEditPost?:()=>void,
}

const API_BASE_URL = __DEV__ 
  'http://8.134.110.79/api/media/v1'
  // ? Platform.select({
  //     // ios: 'http://localhost:8080',
  //     android: 'http://8.134.110.79/api/media/v1',
  //     // android: 'http://10.0.2.2:8080/api/v1',
  //   })
  // : 'http://8.134.110.79/api/media/v1';
  // // : 'http://10.0.2.2:8080/api/v1';


const PostCard: React.FC<PostCardProps> = ({item,commentsCount,router, hasShadow = true,showMoreIcons=true,showDelete=false,onDeletePost,onEditPost}) => {

    const user=useUser(state=>state.user)
    const [likes,setLikes]=useState<number[]>([])
    const [liked,setLiked]=useState(false)
    
    useEffect(() => {
        if (item?.LikeCount) {
            setLikes(item.LikeCount)
            // 更新 liked 状态
            setLiked(item.LikeCount.includes(user?.ID || 0))
        }
    }, [item, user?.ID])

    const onLike =async () => {
        if (!user?.ID || !item?.ID) return;
        
        if(liked){
            let updateLikes = likes.filter(like => like != user.ID)
            setLikes([...updateLikes])
            setLiked(false)
            removePostLike(item.ID)
        }else{
            setLikes([...likes, user.ID])
            setLiked(true)
            createPostLike(item.ID)
        }
        console.log('likes:', likes)
    }

    const share = async () => {
        try {
            const content = stripHtmlTags(item?.Content || '')
            await RNShare.share({
                message: content,
            });
        } catch (error) {
            console.error('分享失败:', error);
        }
    }

    const handleDeletePost=()=>{
      Alert.alert("Confirm","Are you sure you want to delete this post?",[
        {
          text:"Cancel",
          style:"cancel"
        },
        {
          text:"Delete",
          style:"destructive",
          onPress:onDeletePost
        }
      ])
    }

    const [isImageViewVisible, setIsImageViewVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    const mediaUrls = item?.Media?.map(media => {
        const url = media.Uri.startsWith('http') 
            ? media.Uri 
            : `${API_BASE_URL}${media.Uri}`;
        return {
            uri: url,
            type: media.Uri.includes('.mp4') || media.Uri.includes('.mov') || media.Uri.includes('VID') 
                ? 'video' 
                : 'image'
        };
    }) || [];

    const handleMediaPress = (index: number) => {
        const mediaItem = mediaUrls[index];
        if (mediaItem.type === 'video') {
            setSelectedVideo(mediaItem.uri);
        } else {
            setCurrentImageIndex(index);
            setIsImageViewVisible(true);
        }
    };

    const renderMediaItem = ({ item, index }: { item: string; index: number }) => {
        const isVideo = item.includes('.mp4')||item.includes('.mov')||item.includes('VID');
        
        const mediaUrl = item.startsWith('http') 
          ? item 
          : `${API_BASE_URL}${item}`;
    
        return (
          <TouchableOpacity 
            style={styles.mediaPreviewContainer}
            onPress={() => handleMediaPress(index)}
          >   
            {isVideo ? (
              <Video
                source={{ uri: mediaUrl }}
                style={styles.mediaPreview}
                resizeMode={ResizeMode.COVER}
                isLooping
                isMuted={true}
                shouldPlay={false}
              />
            ) : (
              <Image
                source={{ uri: mediaUrl }}
                style={styles.mediaPreview}
                resizeMode="cover"
              />
            )}
          </TouchableOpacity>
        );
    };

    const textStyle={
        color:theme.colors.dark,
        fontSize:hp(1.75),
    }
    const tagStyles={
        div:textStyle,
        p:textStyle,
        span:textStyle,
        ol:textStyle,
        h1:{
            color:theme.colors.dark
        },
        h2:{
            color:theme.colors.dark
        }
    }
    const shadowStyles={
        shadowOffset:{
            width:0,
            height:2
        },
        shadowOpacity:0.06,
        shadowRadius:6,
        elevation:1,     
        
    }
    const postTime = moment(item?.CreatedAt).format("YYYY-MM-DD HH:mm")

    const openPostDetails = () => {
        if(!showMoreIcons) return null;
        router.push({pathname:'/postDetail',params:{postID: String(item?.ID)}})
    }

    // 过滤出图片和视频
    const images = mediaUrls.filter(media => media.type === 'image');

  return (
    <View style={[styles.container,hasShadow && shadowStyles]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Avatar
            size={hp(4.5)}
            uri={item?.User?.Avatar || ""}
            rounded={theme.radius.md}
          />
          <View style={{gap:2}}>
            <Text style={styles.userName}>{item?.User?.Username}</Text>
            <Text style={styles.postTime}>{postTime}</Text>
          </View>    
        </View>

        <View style={styles.headerRight}>
          {showMoreIcons && (
            <TouchableOpacity onPress={openPostDetails}>
              <Icon name="dotsHorizontal" size={hp(3.4)} strokeWidth={3} color="black"/>
            </TouchableOpacity>
          )}
          {showDelete && (
            <View style={styles.actions}>
              <TouchableOpacity onPress={onEditPost}>
                <Icon name="edit" size={hp(3.4)} strokeWidth={3} color="black"/>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeletePost}>
                <Icon name="delete" size={hp(3.4)} strokeWidth={3} color="black"/>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.postBody}>
          {item?.Content && (
            <RenderHtml
              contentWidth={wp(90)}
              source={{html: item.Content}}
              tagsStyles={tagStyles}
            />
          )}
        </View>

        {item?.Media && item.Media.length > 0 && (
          <FlatList
            data={item.Media.map(i => i.Uri)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderMediaItem}
            style={styles.mediaList}
            contentContainerStyle={styles.mediaListContent}
          />
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onLike}>
            <Icon name="heart" size={24} strokeWidth={2} fill={liked?"red":"transparent"} color={liked?"red":"black"}/>
          </TouchableOpacity>
          <Text style={styles.count}>{likes.length || 0}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={openPostDetails}>
            <Icon name="comment" size={24} strokeWidth={2} color={"black"}/>
          </TouchableOpacity>
          <Text style={styles.count}>{commentsCount || 0}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={share}>
            <Icon name="share" size={24} strokeWidth={2} color={"black"}/>
          </TouchableOpacity>
        </View>
      </View>

      <ImageView
        images={images.map(media => ({ uri: media.uri }))}
        imageIndex={currentImageIndex}
        visible={isImageViewVisible}
        onRequestClose={() => setIsImageViewVisible(false)}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
        FooterComponent={({ imageIndex }) => (
            <View style={styles.imageViewerFooter}>
                <Text style={styles.imageViewerText}>
                    {imageIndex + 1} / {images.length}
                </Text>
            </View>
        )}
      />

      <Modal
        visible={!!selectedVideo}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedVideo(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setSelectedVideo(null)}
          >
            <Icon name="cancel" size={24} color="white" />
          </TouchableOpacity>
          {selectedVideo && <VideoPlayer uri={selectedVideo} />}
        </View>
      </Modal>
    </View>
  )
}

export default PostCard

const styles = StyleSheet.create({
    container:{
        gap:10,
        marginBottom:15,
        borderRadius:theme.radius.xxl*1.1,
        borderCurve:'continuous',
        borderWidth:0.5,
        backgroundColor:"white",
        padding:15,
        paddingHorizontal:15,
        borderColor:theme.colors.gray,
        shadowColor:'#000',
    },
    header:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerLeft:{
        flexDirection:'row',
        alignItems:'center',
        gap:8,
    },
    headerRight:{
        flexDirection:'row',
        alignItems:'center',
        gap:10,
    },
    userName:{
        fontSize:hp(1.7),
        fontWeight:'600',
        color:theme.colors.textDark,
    },
    postTime:{
        fontSize:hp(1.3),
        color:theme.colors.textLight,
        fontWeight:'600',
    },
    content:{
        flex: 1,
        width: '100%',
    },
    postBody:{
        width: '100%',
        alignItems: 'flex-start',
        paddingHorizontal: 5,
    },
    footer:{
        flexDirection:'row',
        alignItems:'center',
        gap:15,
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 0.5,
        borderTopColor: theme.colors.gray,
    },
    footerButton:{
        marginLeft:5,
        flexDirection:'row',
        alignItems:'center',
        gap:4,
    },
    actions:{
        flexDirection:'row',
        alignItems:'center',
        gap:18,
    },
    count:{
        color:theme.colors.text,
        fontSize:hp(1.7),
    },
    mediaList: {
        maxHeight: hp(20),
        marginTop: 10,
    },
    mediaListContent: {
        paddingHorizontal: 10,
    },
    mediaPreviewContainer: {
        position: 'relative',
        marginRight: 10,
        borderRadius: theme.radius.lg,
        overflow: 'hidden',
    },
    mediaPreview: {
        width: wp(30),
        height: wp(30),
        borderRadius: theme.radius.lg,
        backgroundColor: theme.colors.gray,
    },
    imageViewerFooter: {
        height: 64,
        backgroundColor: "#00000077",
        alignItems: "center",
        justifyContent: "center",
    },
    imageViewerText: {
        fontSize: hp(1.8),
        color: "#FFF",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
    },
})
