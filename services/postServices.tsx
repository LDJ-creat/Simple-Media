export interface Post{
    body:string,
    image:string[],
    video:string[],
    postID?: string,
}
export interface commentsData{
    userID:string,
    comment:string,
    userName:string,
    userAvatar:string,
    create_at:string,
}
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
export const createOrUpdatePost =async (post:Post)=>{
    try{

    }catch(error){

    }
}

export const getPosts =async ()=>{
    const response:getPost[]=[]
    try{

    }catch(error){
        console.log(error)
    }
    return response
}

interface likesData{
    postID:string,
    userID:string,
}
export const createPostLike=async (data:likesData)=>{

}

export const removePostLike=async (data:likesData)=>{

}

export const getPostDetails=async (postID:string)=>{
    const postResponse:getPost={
        postID:postID,
        userID:"123",
        userName:"张三",
        avatar:"https://img.yzcdn.cn/vant/ipad.png",
        create_at:"2024-01-01 12:00:00",
        post:{
            body:"",
            image:[],
            video:[],
        },
        postLikes:[],
        comments:[],
    }
    return postResponse

}


interface commentData{
    postID:string,
    comment:string,
    userID:string,
}

export const postComment=async (data:commentData)=>{
    try{

    }catch(error){
        console.log(error)
    }
}

export interface deleteCommentData{
    postID:string,
    userID:string,
}
export const deleteComment=async (data:deleteCommentData)=>{
    try{

    }catch(error){
        console.log(error)
    }
}

export const deletePost=async (postID:string)=>{
    try{

    }catch(error){
        console.log(error)
    }
}

export const onEditPost=async (post:Post)=>{
    try{

    }catch(error){
        console.log(error)
    }
}

export const getMyPosts=async(userID:string)=>{
    const response:getPost[]=[]
    try{

    }catch(error){
        console.log(error)
    }
    return response
}