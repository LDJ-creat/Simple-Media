import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'
import {theme} from '../constants/theme'

type LoadingProps = {
    size?: "small" | "large" | number;
    color?: string;
}

const Loading = ({size="large", color=theme.colors.primary}: LoadingProps) => {
    return (
        <View style={{justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator size={size} color={color}/>
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({})