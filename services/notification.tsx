export interface fetchNotificationData{
    postID:string,//对应帖子的ID
    userID:string,//评论者ID
    avatar:string,
    name:string,
    createdAt:string,
}

export const createNotification=async()=>{

}

export const fetchNotifications=async()=>{
    const response:fetchNotificationData[]=[]
    try{

    }catch(error){
        console.log(error)
    }
    return response
}
