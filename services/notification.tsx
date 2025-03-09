import api from "./api";

export interface fetchNotificationData{
    postID:string,//对应帖子的ID
    userID:string,//评论者ID
    avatar:string,
    name:string,
    createdAt:string,
}

// services/notification.ts
export const fetchNotifications = async (): Promise<fetchNotificationData[]> => {
    try {
      const response = await api.get('/notifications');
      if(!response.data){
        return []
      }
      return response.data.map((n: any) => ({
        postID: n.post_id.toString(),
        userID: n.sender_id.toString(),
        avatar: n.sender?.avatar || '',
        name: n.sender?.username || 'Unknown',
        createdAt: n.created_at,
      }));
    } catch (error) {
      console.error('Fetch notifications error:', error);
      return [];
    }
  };
  
  export const getUnreadCount = async (): Promise<number> => {
    try {
      const response = await api.get('/notifications/count');
      return response.data.count;
    } catch (error) {
      console.error('Get unread count error:', error);
      return 0;
    }
  };