import { StyleSheet, Text, View,Alert,Button,Pressable,FlatList, RefreshControl } from 'react-native'
import ScreenWrapper from '@/components/ScreenWrapper'
import {theme} from '@/constants/theme'
import {hp,wp} from '@/helper/common'
import Icon from  '@/assets/icons'
import React, { useState, useEffect } from 'react'
import {useRouter,useLocalSearchParams} from 'expo-router'
import Avatar from '@/components/Avatar'
import {getPost } from '@/services/postServices'
import PostCard from './PostCard'
import Loading from '@/components/Loading'
import { useUser } from '@/store/useUser'
import api from '@/services/api'
import useMyPosts from '@/store/useMyPosts'
import {getUnreadCount } from '@/services/notification'
import AsyncStorage from '@react-native-async-storage/async-storage'

const home = () => {
    const router = useRouter()
    const user = useUser(state => state.user);
    const [posts,setPosts] = useState<getPost[]>([])
    const [isRefreshing,setIsRefreshing] = useState<boolean>(false)
    const [hasMore,setHasMore] = useState<boolean>(true)
    const [notificationsCount,setNotificationsCount] = useState<number>(0)
    const [cursor,setCursor]=useState<string|null>(null)
    const {refresh,postID} = useLocalSearchParams()
    const [newPost,setNewPost]=useState<getPost|null>(null)
    const myPosts = useMyPosts(state => state.myPosts)


    const fetchPosts=async(currentCursor:string|null)=>{
        try{
            const params=new URLSearchParams();
            if(currentCursor){
                params.append("last_id",currentCursor);
            }
            const response=await api.get(`/getPosts?${params}`)
            const newPosts: getPost[]=response.data
            const nextCursor=response.headers['x-next-cursor'] || null
            setHasMore(newPosts.length>0)
            setCursor(nextCursor)
            setPosts(prev=>[...prev,...newPosts])
        }catch(error){
            console.error("Fail to fetch posts:",error)
        }
    }

    useEffect(()=>{
        if(posts.length===0 && hasMore){
            fetchPosts(null)
        }
    },[])

    const handleLoadMore=()=>{
        if(hasMore&&cursor){
            fetchPosts(cursor)
        }
    }

    const handleRefresh=()=>{
        setIsRefreshing(true)
        setCursor(null)
        setPosts([])
        setHasMore(true)
        fetchPosts(null)
        setIsRefreshing(false)
    }

    useEffect(()=>{
        if(refresh){
            handleRefresh()
        }
        if(postID){
            const post=myPosts.find(post=>post.postID===postID)
            if(post){
                setNewPost(post)
            }
        }
    },[refresh,postID])


    useEffect(() => {
        const loadNotifications = async () => {
        const count = await getUnreadCount();
        setNotificationsCount(count);
        };
        loadNotifications();
    }, []);

    useEffect(() => {
        // 从存储中获取用户 Token（示例使用 AsyncStorage）
        const connectWebSocket = async () => {
          const token = await AsyncStorage.getItem('authToken');
          const ws = new WebSocket(`ws://10.0.2.2:8080/ws?token=${token}`);
      
          ws.onopen = () => {
            console.log('WebSocket connected');
          };
      
          ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.type === 'notification') {
              setNotificationsCount(prev => prev + data.count);
            }
          };
      
          ws.onerror = (e) => {
            console.error('WebSocket error:', e);
          };
      
          ws.onclose = () => {
            console.log('WebSocket disconnected');
          };
      
          return () => {
            ws.close(); // 组件卸载时关闭连接
          };
        };
      
        connectWebSocket();
      }, []);


  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>LinkUp</Text>

          <View style={styles.icons}>
            <Pressable onPress={()=>{
                router.push('./notification')
                setNotificationsCount(0)
            }}>
                <Icon name="heart" size={hp(3.2)} strokeWidth={2} color="black"/>


                {
                    notificationsCount>0&&(
                        <View style={styles.pill}>
                            <Text style={styles.pillText}>{notificationsCount}</Text>
                        </View>
                    )
                }
            </Pressable>
            <Pressable onPress={()=>router.push('./newPost')}>
                <Icon name="plus" size={hp(3.2)} strokeWidth={2} color="black"/>
            </Pressable>
            <Pressable onPress={()=>router.push('./profile')}>
                <Avatar 
                uri={user?.avatar||""}//后续替换成向后端请求的数据，无设置则为空
                size={hp(4.5)}
                rounded={theme.radius.sm}
                style={{borderWidth:2}}/>
            </Pressable>
          </View>
        </View>

        <FlatList
            data={newPost?[newPost,...posts]:posts}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listStyle}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
                <PostCard
                item={item}
                router={router}
                />
            )}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={hasMore?(
                <View style={{marginVertical: posts.length==0?200:30}}>
                    <Loading/>
                </View>
            ):(
                <View style={{marginVertical:30}}>
                    <Text style={styles.noPosts}>No more posts</Text>
                </View>
            )}
        />
      </View>
    </ScreenWrapper>
  )
}

export default home

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    header:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginHorizontal:wp(4),
        marginBottom:10,
    },
    title:{
        color:theme.colors.text,
        fontSize:hp(3.2),
        fontWeight:'700',
    },
    avatarImage:{
        width:hp(4.3),
        height:hp(4.3),
        borderRadius:theme.radius.sm,
        borderWidth:3,
        borderColor:theme.colors.gray,
    },
    icons:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        gap:18,
    },
    listStyle:{
        paddingTop:20,
        paddingHorizontal:wp(4),
    },
    noPosts:{
        fontSize:hp(2),
        textAlign:'center',
        color:theme.colors.text,
    },
    pill:{
        position:'absolute',
        right:-10,
        top:-4,
        height:hp(2.2),
        width:hp(2.2),
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:theme.colors.roseLight,
        borderRadius:20,
    },
    pillText:{
        color:"white",
        fontSize:hp(1.2),
        fontWeight:'700',
    },
    media: {
        width: wp(100),
        height: hp(30),
        borderRadius: theme.radius.md,
    }
})