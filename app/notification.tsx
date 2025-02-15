import { StyleSheet, Text, View,ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { fetchNotifications,fetchNotificationData } from '@/services/notification'
import {useState} from 'react'
import { wp ,hp} from '@/helper/common'
import { theme } from '@/constants/theme'
import ScreenWrapper from '@/components/ScreenWrapper'
import NotificationItem from '@/components/NotificationItem'
import { useRouter } from 'expo-router'

const notification = () => {
  const [notifications,setNotifications]=useState<fetchNotificationData[]>([])
  const router=useRouter()
  const getNotification=async()=>{
    let res= await fetchNotifications();
    setNotifications(res)
  }

  useEffect(()=>{
    getNotification()
  },[])


  return (
    <ScreenWrapper bg="white">
        <View style={styles.container}> 
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listStyle}>
            {
              notifications.length>0?(
                notifications.map((item,index)=>(
                  <NotificationItem key={index} item={item} router={router}/>
                ))
              )
              :(
                <Text style={styles.noData}>No notifications</Text>
              )


            }
          </ScrollView>
        </View>
    </ScreenWrapper>
  )

}

export default notification

const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingHorizontal:wp(4),
  },
  listStyle:{
    paddingHorizontal:wp(4),
    gap:10,
  },
  noData:{
    paddingVertical:hp(2),
    fontWeight:'600',
    color:theme.colors.text,
    textAlign:'center',
  },

})