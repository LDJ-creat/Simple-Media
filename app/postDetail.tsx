import { StyleSheet, Text, View,ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { getPost, getPostDetails,postComment,commentsData,deleteComment } from '@/services/postServices'
import PostCard from './PostCard'
import Loading from '@/components/Loading'
import  Input  from '@/components/Input'
import { theme } from '@/constants/theme'
import { hp } from '@/helper/common'
import Icon from '@/assets/icons'
import { useUser } from '@/store/useUser'
import CommentItem from './CommentItem'


const postDetail = () => {
    const user=useUser(state=>state.user)
    const {postID} = useLocalSearchParams()
    const router = useRouter()
    const [post,setPost] = useState<getPost>()
    const [loading,setLoading] = useState(true)
    const [postCommentLoading,setPostCommentLoading]=useState(false)
    const inputRef = useRef<TextInput>(null)
    const commentRef = useRef('')
    const [comments,setComments]=useState(post?.comments || [])
    

    const onDeleteComment=async (comment:commentsData)=>{
        const newComments=comments.filter((c)=>c.userID!==comment.userID)
        setComments(newComments)
        let data={
            postID:postID as string,
            userID:comment.userID,
        }
        await deleteComment(data)

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
        if(!user?.userID) return
        let data={
            postID:postID as string,
            comment:commentRef.current,
            userID:user?.userID,
        }
        let newComment={
            userID:user?.userID,
            comment:commentRef.current,
            userName:user?.userName,
            userAvatar:user?.avatar,
            create_at:new Date().toISOString(),
        }
        await postComment(data)
        setPostCommentLoading(false)
        setComments([...comments,newComment])
        inputRef.current?.clear()
        commentRef.current = ''

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
                <Text>Post not found</Text>
            </View>
        )

    }

  return (
    <View style={styles.container}>
      <ScrollView  showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        <PostCard item={post} commentsCount={comments.length} router={router} hasShadow={false}  showMoreIcons={false}/>

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
                        canDelete={post?.userID===user?.userID||comment?.userID===user?.userID}
                        onDelete={()=>onDeleteComment(comment)}
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

export default postDetail

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    list:{

    },
    center:{

    },
    inputContainer:{
        flexDirection:'row',
        alignItems:'center',
        gap:10,
    },
    loading:{

    },
    sendIcon:{

    }

})