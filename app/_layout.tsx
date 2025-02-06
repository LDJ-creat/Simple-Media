import { StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />

      <Stack.Screen name="postDetail" options={{
        headerShown: true,
        headerTitle: '帖子详情',
        headerBackTitle: '返回',
        headerBackVisible: true,
      }} />
    </GestureHandlerRootView>
  )
}


const styles = StyleSheet.create({})