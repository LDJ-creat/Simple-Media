import { StyleSheet, Text, View,ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { getPost, getPostDetails,postComment,commentsData,deleteComment,deletePost} from '@/services/postServices'
import PostCard from './PostCard'
import Loading from '@/components/Loading'
import  Input  from '@/components/Input'
import { theme } from '@/constants/theme'
import { hp,wp } from '@/helper/common'
import Icon from '@/assets/icons'
import { useUser } from '@/store/useUser'
import CommentItem from './CommentItem'
import useMyPosts from '@/store/useMyPosts'

const PostDetail = () => {
    const user=useUser(state=>state.user)
    const {postID,userID} = useLocalSearchParams()
    const router = useRouter()
    const [post,setPost] = useState<getPost>()
    const [loading,setLoading] = useState(true)
    const [postCommentLoading,setPostCommentLoading]=useState(false)
    const inputRef = useRef<TextInput>(null)
    const commentRef = useRef('')
    const [comments,setComments]=useState(post?.comments || [])
    const deleteMyPost = useMyPosts(state => state.deleteMyPosts)
    
    
    const onDeletePost=async (postID:string)=>{
        await deletePost(postID as string)
        //home页面中通过订阅数据库变化，会自动更新,但这里采用传参刷新的方式
        deleteMyPost(postID as string)
        router.navigate({pathname:'/home',params:{refresh:'true'}})
    }

    const onEditPost=async (post:getPost)=>{
        router.back()
        router.push({
            pathname: '/newPost',
            params:{
                post:JSON.stringify(post),
            }
        })
    }



    useEffect(()=>{
        const fetchPost = async () => {
            const postResponse = await getPostDetails(postID as string)
            setPost(postResponse)
            setLoading(false)
        }
        fetchPost()
    },[])

    const onNewComment = async () => {
        if(commentRef.current.trim().length === 0){
            return
        }
        setPostCommentLoading(true)
        if(!user?.ID) return
        let data={
            postID:postID as string,
            comment:commentRef.current,
        }
        let newComment={
            userID:String(user?.ID),
            comment:commentRef.current,
            username:user?.Username,
            avatar:user?.Avatar,
            create_at:new Date().toISOString(),
        }
        await postComment(data)

        setPostCommentLoading(false)
        setComments([...comments,newComment])
        inputRef.current?.clear()
        commentRef.current = ''


    }

    const onDeleteComment=async (comment:commentsData)=>{
        const newComments=comments.filter((c)=>c.userID!==comment.userID)
        setComments(newComments)
        await deleteComment(postID as string)

    }


    if(loading){
        return (
            <View style={styles.center}>
                <Loading/>
            </View>
        )

    }

    if(!post){
        return(
            <View style={[styles.center,{justifyContent:'flex-start',marginTop:100}]}>
                <Text style={styles.notFound}>Post not found</Text>
            </View>
        )


    }

  return (
    <View style={styles.container}>
      <ScrollView  showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        <PostCard 
            item={post} 
            commentsCount={comments.length} 
            router={router} hasShadow={false}  
            showMoreIcons={false}
            showDelete={post?.userID===String(user?.ID)}
            onDeletePost={()=>onDeletePost(postID as string)}
            onEditPost={()=>onEditPost(post)}
        />




        <View style={styles.inputContainer}>
            <Input
            inputRef={inputRef}
            onChangeText={(text)=>{
                commentRef.current = text
            }}
            placeholder="Type comment..."
            placeholderTextColor={theme.colors.textLight}

            containerStyle={{
                flex:1,
                height:hp(6.2),
                borderRadius:theme.radius.xl,
                
            }}
            />
            {
                postCommentLoading?(
                    <View style={styles.loading}>
                        <Loading/>
                    </View>
                ):(
                    <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
                        <Icon name="send" />        
                    </TouchableOpacity>
                )
            }
        </View>


        <View style={{marginVertical:15, gap:17}}>
            {
                post?.comments.map((comment)=>(
                    <CommentItem
                        item={comment}
                        canDelete={post?.userID===String(user?.ID)||comment?.userID===String(user?.ID)}
                        onDelete={()=>onDeleteComment(comment)}
                        highLight={userID===comment?.userID}
                        />
                ))


            }
            {
                post?.comments?.length==0&&(

                    <Text style={{color:theme.colors.text,marginLeft:5}}>
                        Be first to comment!
                    </Text>
                )
            }
        </View>
      </ScrollView>

    </View>





  )
}

export default PostDetail

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
    },

    list:{
        paddingHorizontal:wp(4),
    },
    center:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    inputContainer:{
        flexDirection:'row',
        alignItems:'center',
        gap:10,
    },
    loading:{
        height:hp(5.8),
        width:hp(5.8),
        justifyContent:'center',
        alignItems:'center',
        transform:[{scale:1.3}]
    },
    sendIcon:{
        borderColor:theme.colors.primary,
        borderRadius:theme.radius.lg,
        borderCurve:'continuous',
        height:hp(5.8),
        width:hp(5.8),
    },
    notFound:{
        fontSize:hp(2.5),
        color:theme.colors.text,
        fontWeight:'600',
    }


})