import { Platform } from "react-native";

export const getImageUrl = (imagePath: string) => {
    if(imagePath!=""&&imagePath!="/static/avatars/default.png"){
        const API_BASE_URL = __DEV__ 
        ? Platform.select({
            ios: 'http://localhost:8080/api/media/v1',
            android: 'http://10.0.2.2:8080/api/media/v1',
          })
        : 'http://8.134.110.79/api/media/v1';
        return `${API_BASE_URL}${imagePath}`;
    }else{
        return require('@/assets/images/avatar.png')
    }
}