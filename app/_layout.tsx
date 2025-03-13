import { StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import UpdateChecker from './components/UpdateChecker'

export default function RootLayout() {
  return (
    <>
      <UpdateChecker />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right'
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="postDetail" options={{
            headerShown: true,
            headerTitle: '帖子详情',
            headerBackTitle: '返回',
          }} />
        </Stack>
      </GestureHandlerRootView>
    </>
  )
}

const styles = StyleSheet.create({})