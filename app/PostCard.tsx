import { StyleSheet, Text, TouchableOpacity, View, Image, FlatList,Alert, Share as RNShare } from 'react-native'
import React, { useState } from 'react'
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



const PostCard: React.FC<PostCardProps> = ({item,commentsCount,router, hasShadow = true,showMoreIcons=true,showDelete=false,onDeletePost,onEditPost}) => {
    const user=useUser(state=>state.user)
    const [likes,setLikes]=useState<string[]>([])
    const liked = likes.find(like => like === String(user?.ID)) ? true : false
    
    const onLike =async () => {
        if (!user?.ID || !item?.ID) return;
        
        if(liked){
            let updateLikes = likes.filter(like => like !== String(user.ID))
            setLikes([...updateLikes])
            removePostLike(String(item.ID))
        }else{
            setLikes([...likes, String(user.ID)])
            createPostLike(String(item.ID))
        }
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

    const renderMediaItem = ({ item, index }: { item: string; index: number }) => {
        const isVideo =item.includes('.mp4')||item.includes('.mov')||item.includes('VID');
    
        return (
          <View style={styles.mediaPreviewContainer}>   
            {isVideo ? (
              <Video
                source={{ uri: item }}
                style={styles.mediaPreview}
                resizeMode={ResizeMode.COVER}
                isLooping
                isMuted={true}
                shouldPlay={false}
              />
            ) : (
              <Image
                source={{ uri: item }}
                style={styles.mediaPreview}
                resizeMode="cover"
              />
            )}
          </View>
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
          <Text style={styles.count}>{item?.LikeCount || 0}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={openPostDetails}>
            <Icon name="comment" size={24} strokeWidth={2} color={"black"}/>
          </TouchableOpacity>
          <Text style={styles.count}>{(item?.Comment?.length || 0)}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={share}>
            <Icon name="share" size={24} strokeWidth={2} color={"black"}/>
          </TouchableOpacity>
        </View>
      </View>
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
    },
    mediaPreview: {
        width: wp(30),
        height: wp(30),
        borderRadius: theme.radius.lg,
        backgroundColor: theme.colors.gray,
    },
})