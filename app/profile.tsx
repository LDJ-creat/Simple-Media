import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Header from '@/components/Header'
import { wp ,hp} from '@/helper/common'
import { theme } from '@/constants/theme'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from '@/assets/icons'
import { useRouter, Router } from 'expo-router'
import Avatar from '@/components/Avatar'
import { userData } from '@/services/getUserData'
import { useUser } from '@/store/useUser'
import { deletePost, getMyPosts, getPost } from '@/services/postServices'
import Loading from '@/components/Loading'
import PostCard from './PostCard'
import api from '@/services/api'
import useMyPosts from '@/store/useMyPosts'
const UserHeader = ({user,router, handleLogout}: { user:userData|null,router: Router, handleLogout: () => void }) => {
  
  return (
      <View style={{flex:1,backgroundColor:'white',paddingHorizontal:wp(4)}}>
        <View style={{position:"relative"}}>
          <Header title={"Profile"} showBackButton={true} mb={30}/>
          <TouchableOpacity style={styles.logoutButton}>
            <Icon name="logout" color={theme.colors.rose} onPress={handleLogout} />
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <View style={{gap:15}}>
            <View style={styles.avatarContainer}>
              <Avatar
                uri={user?.avatar || ""}
                size={hp(12)}
                rounded={theme.radius.xxl*1.4}
              />
              <Pressable style={styles.editIcon} onPress={()=>router.push('./editProfile')}>
                <Icon name="edit" strokeWidth={2.5} size={20} color="black"/>
              </Pressable>
            </View>

            <View style={{alignItems:'center',gap:4}}>
              <Text style={styles.userName}>{user?.userName}</Text>
            </View>

            <View style={{gap:10}}>
              <View style={styles.info}>
                <Icon name="email" size={20} color={theme.colors.textLight}/>
                <Text style={styles.infoText}>{user?.email}</Text>
              </View>
              <View style={styles.info}>
                <Icon name="phone" size={20} color={theme.colors.textLight}/>
                <Text style={styles.infoText}>{user?.phone}</Text>
              </View>
              <View style={styles.info}>
                <Icon name="signature" size={20} color={theme.colors.textLight}/>
                <Text style={styles.infoText}>{user?.signature}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
  )
}

const profile = () => {
  const router = useRouter();
  const setUser = useUser(state => state.setUser);
  const user = useUser(state => state.user);
  const [cursor,setCursor]=useState<string|null>(null)
  // const [posts,setPosts] = useState<getPost[]>([])
  const [hasMore,setHasMore] = useState<boolean>(true)
  const posts = useMyPosts(state => state.myPosts)
  const setMyPosts = useMyPosts(state => state.setMyPosts)//全局管理myPosts
  const clearMyPosts = useMyPosts(state => state.clearMyPosts)


  const fetchMyPosts=async(currentCursor:string|null)=>{
    try{
        const params=new URLSearchParams();
        if(currentCursor){
            params.append("last_id",currentCursor);
        }
        const response=await api.get(`/getMyPosts?${params}`)
        const newPosts: getPost[]=response.data
        const nextCursor=response.headers['x-next-cursor'] || null
        setHasMore(newPosts.length>0)
        setCursor(nextCursor)
        setMyPosts([...posts, ...newPosts])
    }catch(error){
        console.error("Fail to fetch my posts:",error)
    }
 }
 
  useEffect(()=>{
      if(posts.length===0 && hasMore){
          fetchMyPosts(null)
      }
  },[])



  const handleLoadMore=()=>{
    if(hasMore&&cursor){
        fetchMyPosts(cursor)
    }
}

  const Logout = () => {
    setUser(null)
    clearMyPosts()
    router.push('/Login')
  }
  const handleLogout = async () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to log out",
      [
        {
          text: "Cancel",
          onPress: () => console.log("modal canceled"),
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => Logout(),
          style: "destructive"
        }
      ]
    );
  }


  const handleDeletePost=async(postID:string)=>{
    await deletePost(postID)
  }
  return (
    <ScreenWrapper bg="white">
      <FlatList
            data={posts}
            ListHeaderComponent={<UserHeader user={user} handleLogout={handleLogout} router={router} />}
            ListHeaderComponentStyle={{marginBottom:10}}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listStyle}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
                <PostCard
                item={item}
                router={router}
                onDeletePost={()=>handleDeletePost(item.postID as string)}
                />
            )}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={hasMore?(
                <View style={{marginVertical: posts.length==0?100:30}}>
                    <Loading/>
                </View>
            ):(
                <View style={{marginVertical:30}}>
                    <Text style={styles.noPosts}>No more posts</Text>
                </View>
            )}
        />
    </ScreenWrapper>
  )
}

export default profile

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  headerContainer:{
    marginHorizontal:wp(4),
    marginBottom:20,
  },
  headerShape:{
    width:wp(100),
    height:hp(20),
  },
  avatarContainer:{
    height:hp(12),
    width:hp(12),
    alignSelf:'center',
  },
  editIcon:{
    position:'absolute',
    bottom:0,
    right:-12,
    padding:7,
    borderRadius:50,
    backgroundColor:theme.colors.textLight,
    shadowOffset:{width:0,height:4},
    shadowOpacity:0.4,
    shadowRadius:5,
    elevation:7
  },
  userName:{
    fontSize:hp(3),
    fontWeight:'500',
    color:theme.colors.textDark,
    textAlign:'center',
  },
  info:{
    gap:10,
    borderBottomWidth: 1
  },
  infoText:{
    fontSize:hp(1.6),
    fontWeight:'500',
    color:theme.colors.textLight,
  },
  logoutButton:{
    position:'absolute',
    right:0,
    top: -60,
    padding:5,
    borderRadius:theme.radius.sm,
    backgroundColor:'#fee2e2',
    zIndex: 1
  },
  listStyle:{
    paddingHorizontal:wp(4),
    paddingBottom:30,
  },
  noPosts:{
    fontSize:hp(2),
    textAlign:'center',
    color:theme.colors.text,
  }
})