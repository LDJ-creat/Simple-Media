import api from "@/services/api"


export interface mediaData{
    id:string,
    uri:string,
    name:string,
    type:string,
}
export interface Post{
    content:string,
    media:mediaData[],
    postID?: string,
}
export interface commentsData{
    userID:string,
    comment:string,
    userName:string,
    userAvatar:string,
    create_at:string,
}

// export interface fetchPost{
//     postID:string,
//     userID:string,
//     userName:string,
//     avatar:string,
//     create_at:string,
//     post:Post,
//     postLikes:number,
//     commentCount:number,
// }
export interface getPost{
    postID:string,
    userID:string,
    userName:string,
    avatar:string,
    create_at:string,
    post:Post,
    postLikes:string[],//存储点赞的用户的userID
    comments:commentsData[],
}


export const createPost =async (post:Post)=>{
    const form=new FormData()
    post.media.forEach((item,index)=>{
        form.append("media",{
            uri:item.uri,
            name:item.name,
            type:item.type,
        } as any)
    })
    // post.videos.forEach((item,index)=>{
    //     form.append("videos",{
    //         uri:item.url,
    //         name:"video"+index+".mp4",
    //         type:"video/mp4",
    //         id:item.id,
    //     } as any)
    // })
    form.append("content",post.content)
    try{
        const response=await api.post("/post",form)
        return response.data
    }catch(error){
        console.log(error)
    }
}


export const updatePost=async (post:Post)=>{
    const keepMedia=post.media.filter((item)=>item.id)
    const newMedia=post.media.filter((item)=>!item.id)
    const form=new FormData()
    const keepMediaIDs=keepMedia.map((item)=>item.id)
    form.append("keepMediaIDs",keepMediaIDs.join(","))
    newMedia.forEach((item,index)=>{
        form.append("media",{
            uri:item.uri,
            name:item.name,
            type:item.type,
        } as any)
    })
    form.append("content",post.content)
    try{
        await api.put(`/post/${post.postID}`,form)
    }catch(error){
        console.log(error)
    }
}

export const deletePost=async (postID:string)=>{
    try{
        await api.delete(`/post/${postID}`)
    }catch(error){
        console.log(error)
    }
}


export const createPostLike=async (postID:string)=>{

    try{
        await api.post(`/addLike/${postID}`)
    }catch (error){
        console.log(error)
    }
}

export const removePostLike=async (postID: string)=>{
    try{
        await api.post(`/subLike/${postID}`)
    }catch (error){
        console.log(error)
    }
}



export const getPostDetails=async (postID:string)=>{
    // const postResponse:getPost={
    //     postID:postID,
    //     userID:"123",
    //     userName:"张三",
    //     avatar:"https://img.yzcdn.cn/vant/ipad.png",
    //     create_at:"2024-01-01 12:00:00",
    //     post:{
    //         content:"",
    //         images:[],
    //         videos:[],
    //     },
    //     postLikes:[],
    //     comments:[],
    // }
    const postResponse=await api.get(`/postDetails/${postID}`)
    return postResponse.data

}


interface commentData{
    postID:string,
    comment:string,
}

export const postComment=async (data:commentData)=>{
    try{
        await api.post(`/addComment`,data)
    }catch(error){
        console.log(error)
    }
}

// export interface deleteCommentData{
//     postID:string,
//     userID:string,
// }
//因为前端没有同步更新新创建的comment的id,所以这里使用postID来删除评论，userID在后端通过解析token获取,当然其实也可以在addComment的时候，后端返回comment的id，然后前端同步
export const deleteComment=async (postID:string)=>{
    try{
        await api.post(`/deleteComment/${postID}`)
    }catch(error){
        console.log(error)
    }
}



// export const onEditPost=async (post:Post)=>{
//     const form=new FormData()
//     post.images.forEach((item,index)=>{
//         form.append("images",{
//             uri:item.url,
//             name:"image"+index+".jpg",
//             type:"image/jpeg",
//             id:item.id,
//         } as any)
//     })
//     post.videos.forEach((item,index)=>{
//         form.append("videos",{
//             uri:item.url,
//             name:"video"+index+".mp4",
//             type:"video/mp4",
//             id:item.id,
//         } as any)
//     })
//     form.append("content",post.content)
//     try{
//         await api.post("/post",form)
        
//     }catch(error){
//         console.log(error)
//     }
// }

export const getMyPosts=async(userID:string)=>{
    const response:getPost[]=[]
    try{

    }catch(error){
        console.log(error)
    }
    return response
}