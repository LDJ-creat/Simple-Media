import { Platform } from "react-native";

export const getImageUrl = (imagePath: string) => {
    if(imagePath!=""&&imagePath!="/static/avatars/default.png"){
        const API_BASE_URL = __DEV__ 
        ? Platform.select({
            ios: 'http://localhost:8080',
            android: 'http://8.134.110.79:8081',
          })
        : 'http://8.134.110.79:8081';
        return `${API_BASE_URL}${imagePath}`;
    }else{
        return require('@/assets/images/avatar.png')
    }
}