import React from "react";
import { Text, View, Image, Pressable } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import{ StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { wp,hp } from "../helper/common";
import { theme } from "../constants/theme";
import Button from "../components/Button";
import {router} from 'expo-router'

const Welcome = () => {
  return(
    <ScreenWrapper bg="white">
        <StatusBar style="dark"/>
        <View style={styles.container}>
            <Image source={require("../assets/images/welcome.jpg")} style={styles.welcomeImg} resizeMode="contain"/>
            <View style={{gap:20}}>
                <Text style={styles.title}>LinkUp!</Text>
                <Text style={styles.punchline}>Where every thought finds a home and every image tells a story.</Text>
            </View>
            <View style={styles.footer}>
                <Button title="Getting Started" onPress={()=>{router.push('/SignUp')}}/>
            </View>
            <View style={styles.buttonTextContainer}>
                <Text style={styles.loginText}>
                    Already have aan account!
                </Text>
                <Pressable onPress={()=>router.push('/Login')}>
                    <Text style={[styles.loginText,{
                        color:theme.colors.primaryDark,
                        fontWeight:"600"
                    }]}>
                        Login
                    </Text>
                </Pressable>
            </View>
        </View>

    </ScreenWrapper>
  )
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"space-between",
        alignItems:"center",
        backgroundColor:"white",
        paddingHorizontal:wp(5),
        paddingVertical: hp(5),
    },
    welcomeImg:{
        width:wp(100),
        height:hp(30),
        alignSelf:"center",
    },
    title:{
        color:theme.colors.text,
        fontSize:hp(4),
        fontWeight:"800",
        textAlign:"center",
    },
    punchline:{
        color:theme.colors.text,
        fontSize:hp(2),
        textAlign:"center",
        paddingHorizontal:wp(10),
    },
    footer:{
        gap:30,
        width:'100%',
        marginTop: hp(5),
    },
    buttonTextContainer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        gap:5,
        marginTop: hp(2),
    },
    loginText:{
        textAlign:'center',
        color:theme.colors.text,
        fontSize:hp(1.6)
    }

})

export default Welcome;
