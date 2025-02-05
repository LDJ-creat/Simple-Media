import { StyleSheet, Text, View,Pressable } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { theme } from '../constants/theme'
import { router } from 'expo-router'
import Icon from "@/assets/icons"
import {hp,wp} from '@/helper/common'

const index = () => {
  return (
    <ScreenWrapper bg={theme.colors.primary}>
      <Text>hello</Text>
      <Pressable onPress={()=>{
        router.push('./home')
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