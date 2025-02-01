import { StyleSheet, Text, View,Pressable } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { theme } from '../constants/theme'
import { router } from 'expo-router'

const index = () => {
  return (
    <ScreenWrapper bg={theme.colors.primary}>
      <Text>hello</Text>
      <Pressable onPress={()=>{
        router.push('/welcome')
      }}>
        <Text>
            welcome
        </Text>
      </Pressable>
    </ScreenWrapper>
  )
}

export default index

const styles = StyleSheet.create({})