import { StyleSheet, Text, View, StyleProp, ImageStyle } from 'react-native'
import React from 'react'
import {hp} from '@/helper/common'
import {theme} from '@/constants/theme'
import {Image} from 'expo-image'
import {getImageUrl} from '@/services/imagesServices'

interface AvatarProps {
    uri: string;
    size?: number;
    rounded?: number;
    style?: StyleProp<ImageStyle>;
}

const Avatar = ({
    uri,
    size=hp(4.5),
    rounded=theme.radius.md,
    style={}
}: AvatarProps) => {
  return (
    <Image source={getImageUrl(uri)} style={[styles.avatar,{width:size,height:size,borderRadius:rounded},style]}/>
  )
}

export default Avatar

const styles = StyleSheet.create({
    avatar:{
        borderCurve:'continuous',
        borderColor:theme.colors.darkLight,
        borderWidth:1,
    }
})