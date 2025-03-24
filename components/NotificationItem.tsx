import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import { theme } from '@/constants/theme'
import { hp } from '@/helper/common'
import { fetchNotificationData } from '@/services/notification'
import { useRouter } from 'expo-router'
import Avatar from './Avatar'
import moment from 'moment'

interface NotificationItemProps{
    item:fetchNotificationData,
    router:ReturnType<typeof useRouter>,
}


const NotificationItem = ({item,router}:NotificationItemProps) => {
    const createdAt=moment(item?.createdAt).format('YYYY-MM-DD')
    const handleClick=()=>{
        //open detail page
        console.log(item.postID)
        console.log(item.userID)
        router.push({pathname:"/postDetail",params:{//注意这里的pathname直接写/postDetail接口，不需要写相对路径../app/postDetail
            postID:item?.postID,
            userID:item?.userID,
        }})
    }



  return (
    <TouchableOpacity style={styles.container} onPress={handleClick}>
        <Avatar uri={item?.avatar} size={hp(5)}/>
        <View style={styles.nameTitle}>
            <Text style={styles.text}>{item?.name}</Text>
            <Text style={styles.text}>commented on your post</Text>
        </View>

        <Text style={[styles.text,{color:theme.colors.textLight}]}>{createdAt}</Text>
    </TouchableOpacity>


  )
}




export default NotificationItem


const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        gap:12,
        backgroundColor:'white',
        borderWidth:0.5,
        borderColor:theme.colors.darkLight,
        borderRadius:theme.radius.xxl,
        borderCurve:'continuous',
        padding:15,
    },
    nameTitle:{
        flex:1,
        gap:2,
    },
    text:{
        fontSize:hp(1.6),
        fontWeight:'600',
        color:theme.colors.text,
    }

})