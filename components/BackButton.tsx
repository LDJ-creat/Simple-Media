import { StyleSheet, Text, View,Pressable } from 'react-native'
import React from 'react'
import Icon from '@/assets/icons'
import { Router } from 'expo-router'
import { theme } from '@/constants/theme'
const BackButton = ({size=26,router}: {size?: number, router: Router}) => {
  return (
    <Pressable onPress={()=>router.back()} style={styles.button}>
        <Icon name="arrowLeft" size={size} strokeWidth={2.5} color="black"/>
    </Pressable>
  ) 
}

export default BackButton

const styles = StyleSheet.create({
    button:{
        alignSelf:'flex-start',
        padding:5,
        borderRadius:theme.radius.sm,
        backgroundColor:'rgba(0,0,0,0.07'
    }
})