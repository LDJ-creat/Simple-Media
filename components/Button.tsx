import { StyleSheet, Text, Pressable, ViewStyle, TextStyle, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { hp } from '../helper/common'
import Loading from './Loading'

interface ButtonProps {
    buttonStyle?: ViewStyle;
    textStyle?: TextStyle;
    title: string;
    onPress: () => void;
    loading?: boolean;
    hasShadow?: boolean;
}

const Button = ({buttonStyle, textStyle, title = '', onPress = () => {}, loading = false, hasShadow = true}: ButtonProps) => {
  const shadowStyle={
    shadowColor:theme.colors.dark,
    shadowOffset:{width:0,height:10},
    shadowOpacity:0.2,
    shadowRadius:8,
    elevation:4
  }

  if(loading){
    return(
        <View style={[styles.button,buttonStyle,{backgroundColor:'white'}]}>
            <Loading/>
        </View>
    )
  }
    return (
    <Pressable onPress={onPress} style={[styles.button,buttonStyle,hasShadow&&shadowStyle]}>
        <Text style={[styles.text,textStyle]}>{title}</Text>
    </Pressable>
  )
}

export default Button

const styles = StyleSheet.create({
    button:{
        borderLeftColor:theme.colors.primary,
        backgroundColor: theme.colors.primary,
        height:hp(6.6),
        justifyContent:"center",
        alignItems:"center",
        borderRadius:theme.radius.xl,
        borderCurve:"continuous",
    },
    text:{
        fontSize:hp(2.5),
        color:'white',
        fontWeight:"600",
    }
})
