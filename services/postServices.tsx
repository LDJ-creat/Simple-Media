import api from "@/services/api"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { userData } from "./getUserData";


export interface mediaData{
    ID:string,
    Uri:string,
    Name:string,
    Type:string,
}
export interface Post{
    content:string,
    media:mediaData[],
    postID?: string,
}
export interface commentsData{
    PostID:string,
    UserID:string,
    Content:string,
    Username:string,
    CreatedAt:string,
    User:userData,
}

export interface getPost {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: null | string;
    UserID: number;
    Content: string;
    LikeCount:number[];
    Media: mediaData[];
    User:userData,
    Comment: commentsData[],
}


export const createPost =async (post:Post)=>{
    const formData = new FormData()
    
    // 添加文本内容
    formData.append('content', post.content)
    
    // 添加媒体文件
    if (post.media && post.media.length > 0) {
        post.media.forEach((item) => {
            const fileType = item.Type === 'video' ? 'video/mp4' : 'image/jpeg'
            const fileName = item.Name || `${Date.now()}.${item.Type === 'video' ? 'mp4' : 'jpg'}`
            
            // 确保文件对象格式正确
            const fileData = {
                uri: Platform.OS === 'android' ? item.Uri : item.Uri.replace('file://', ''),
                type: fileType,
                name: fileName
            }
            
            // 使用正确的字段名添加文件
            formData.append('media[]', fileData as any)
        })
    }

    try {
        console.log('FormData content:', JSON.stringify(Array.from((formData as any)._parts)));
        const response = await api.post("/post", formData)
        console.log('Response:', response.data);
        return response.data
    } catch(error) {
        console.log('[CreatePost Error]:', error)
        throw error
    }
}


export const updatePost=async (post:Post)=>{
    const formData = new FormData()
    
    // 添加保留的媒体ID
    const keepMedia = post.media.filter(item => item.ID)
    formData.append('keepMediaIDs', keepMedia.map(item => item.ID).join(','))
    
    // 添加新媒体文件
    const newMedia = post.media.filter(item => !item.ID)
    newMedia.forEach((item) => {
        const fileType = item.Type === 'video' ? 'video/mp4' : 'image/jpeg'
        const file = {
            uri: Platform.OS === 'android' ? item.Uri : item.Uri.replace('file://', ''),
            type: fileType,
            name: item.Name || `${Date.now()}.${fileType === 'video/mp4' ? 'mp4' : 'jpg'}`
        }
        formData.append('media[]', file as any)
    })

    // 添加文本内容
    formData.append('content', post.content)

    try {
        await api.put(`/post/${post.postID}`, formData)
    } catch(error) {
        console.log('[UpdatePost Error]:', error)
        throw error
    }
}

export const deletePost=async (postID:number)=>{
    try{
        await api.delete(`/post/${postID}`)
    }catch(error){
        console.log(error)
    }
}


export const createPostLike=async (postID:number)=>{

    try{
        await api.post(`/addLike/${postID}`)
    }catch (error){
        console.log(error)
    }
}

export const removePostLike=async (postID: number)=>{
    try{
        await api.put(`/subLike/${postID}`)
    }catch (error){
        console.log(error)
    }
}



export const getPostDetails=async (postID:number)=>{

    const postResponse=await api.get(`/postDetails/${postID}`)
    return postResponse.data

}


interface commentData{
    PostID:number,
    Content:string,
}

export const postComment=async (data:commentData)=>{
    try{
        const response = await api.post(`/addComment`,data)
        console.log('Comment response:', response.data)
        return response.data
    }catch(error){
        console.error('[PostComment Error]:', error)
        throw error
    }
}

// export interface deleteCommentData{
//     postID:string,
//     userID:string,
// }
//因为前端没有同步更新新创建的comment的id,所以这里使用postID来删除评论，userID在后端通过解析token获取,当然其实也可以在addComment的时候，后端返回comment的id，然后前端同步
export const deleteComment=async (postID:number)=>{
    try{
        await api.delete(`/deleteComment/${postID}`)
    }catch(error){
        console.log(error)
    }
}


export const getMyPosts=async()=>{
    const response:getPost[]=[]
    try{

    }catch(error){
        console.log(error)
    }
    return response
}