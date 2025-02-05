import { StyleSheet, Text, TouchableOpacity, View, Image, FlatList } from 'react-native'
import React from 'react'
import {theme} from '@/constants/theme'
import {hp,wp} from '@/helper/common'
import Avatar from '@/components/Avatar'
import {getPost} from "@/services/postServices"
import moment from "moment"
import Icon from  '@/assets/icons'
import RenderHtml from "react-native-render-html"
import { Video,ResizeMode } from 'expo-av'

interface PostCardProps {
    item: getPost;
    router: any;
    hasShadow?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({item, router, hasShadow = true}) => {
    const liked=false

    const renderMediaItem = ({ item, index }: { item: string; index: number }) => {
        const isVideo = item.includes('.mp4') || item.includes('.mov')||item.includes('VID');
    
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
  const postTime=moment(item?.create_at).format("YYYY-MM-DD HH:mm")
  const openPostDetails=()=>{

  }
  return (
    <View style={[styles.container,hasShadow && shadowStyles]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar
            size={hp(4.5)}
            uri={item?.avatar}
            rounded={theme.radius.md}
          />
          <View style={{gap:2}}>
            <Text style={styles.userName}>{item?.userName}</Text>
            <Text style={styles.postTime}>{postTime}</Text>
          </View>    
          <TouchableOpacity onPress={openPostDetails}>
            <Icon name="dotsHorizontal" size={hp(3.4)} strokeWidth={3} color="black"/>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.postBody}>
            {item?.post?.body && (
              <RenderHtml
                contentWidth={wp(100)}
                source={{html:item?.post?.body}}
                tagsStyles={tagStyles}
              />
            )}
          </View>
        </View>

        {item?.post?.image && (
          <FlatList
          data={[...item?.post?.image, ...item?.post?.video]}
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
          <TouchableOpacity>
          <Icon name="heart" size={24} strokeWidth={2} fill={liked?"red":"transparent"} color={liked?"red":"black"}/>
          </TouchableOpacity>
          <Text style={styles.count}>0</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity>
          <Icon name="comment" size={24} strokeWidth={2} color={"black"}/>
          </TouchableOpacity>
          <Text style={styles.count}>0</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity>
          <Icon name="share" size={24} strokeWidth={2} color={"black"}/>
          </TouchableOpacity>
          <Text style={styles.count}>0</Text>
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
        padding:10,
        paddingHorizontal:12,
        borderColor:theme.colors.gray,
        shadowColor:'#000',
    },
    header:{
        flexDirection:'row',
        justifyContent:'space-between',
    },
    userInfo:{
        flexDirection:'row',
        alignItems:'center',
        gap:8,
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
        gap:10,
    },
    postMedia:{
        width:"40%",
        height:hp(20),
        borderRadius:theme.radius.xl,
        borderCurve:'continuous',   
    },
    postBody:{
        marginLeft:5,
    },
    footer:{
        flexDirection:'row',
        alignItems:'center',
        gap:15,
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
    media: {
        width: wp(100),
        height: hp(30),
        borderRadius: theme.radius.md,
    },
    imageList: {
        gap: 10,
        paddingHorizontal: 5,
        maxHeight:hp(20),
    },
    mediaList: {
        maxHeight: hp(20),
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