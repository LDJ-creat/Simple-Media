import { StyleSheet, Text, View,Pressable } from 'react-native'
import React, { useEffect } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { theme } from '../constants/theme'
import { router } from 'expo-router'
import Icon from "@/assets/icons"
import {hp,wp} from '@/helper/common'
import AsyncStorage from '@react-native-async-storage/async-storage'

const index = () => {
  useEffect(()=>{
    const checkAuth=async()=>{
      const token=await AsyncStorage.getItem('token')
      if(token){
        setTimeout(()=>{
          router.push('./home')
        },1500)
      }else{
        setTimeout(()=>{
          router.push('./Login')
        },1500)
      }
    }
    checkAuth()
  },[])
  return (
    <ScreenWrapper bg={theme.colors.primary}>
      <View style={styles.container}>
        <Text style={styles.text}>hello</Text>
      </View>
      {/* <Pressable onPress={()=>{
        router.push('./home')
      }}>
        <Text>
            welcome
        </Text>
      </Pressable> */}
    </ScreenWrapper>
  )
}

export default index

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'black'
  },
  text:{
    fontSize:wp(10),
    fontWeight:'bold',
    color:'#fff'
  }
})