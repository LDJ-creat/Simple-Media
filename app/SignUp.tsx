import { StyleSheet, Text, View, Pressable, Alert } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { StatusBar } from 'expo-status-bar'
import BackButton  from '../components/BackButton'
import { useRouter } from 'expo-router'
import { hp, wp } from '@/helper/common'
import { theme } from '@/constants/theme'
import Icon from '@/assets/icons'
import Input from '@/components/Input'
import { useState} from 'react'
import Button from '@/components/Button'
import { HandleSignUp } from '@/services/getUserData'
import { useUser } from '@/store/useUser'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Login = () => {
    const router = useRouter();
    const setUser=useUser(state=>state.setUser)
    const[loading, setLoading] = useState(false);
    const[name, setName] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const submit=async ()=>{
        if(!name.trim() || !email.trim() || !password.trim()){
            Alert.alert('Please fill all fields')
            return;
        }
        setLoading(true)
        const signUpData={
            userName:name,
            email:email,
            password:password
        }
        const response=await HandleSignUp(signUpData)
        setUser(response.userData)
        AsyncStorage.setItem('token',response.token)
        setLoading(false)
        setName('')
        setEmail('')
        setPassword('')
    }
    return (
        <ScreenWrapper bg="white">
            <StatusBar style="dark"/>
            <View style={styles.container}>
                <BackButton router={router}/>
                <View>
                    <Text style={styles.welcomeText}>Let's</Text>
                    <Text style={styles.welcomeText}>Get Started</Text>
                </View>
                <View style={styles.form}>
                    <Text>
                        Please sign up to continue
                    </Text>
                    <Input placeholder='Enter your name'
                     icon={<Icon name='user' size={26} strokeWidth={1.5}/>}
                     onChangeText={setName}
                     value={name}/>

                    <Input placeholder='Enter your email'
                     icon={<Icon name='email' size={26} strokeWidth={1.5}/>}
                     onChangeText={setPassword}
                     value={password}/>

                    <Input placeholder='Enter your password'
                     icon={<Icon name='lock' size={26} strokeWidth={1.5}/>}
                     secureTextEntry={true}
                     onChangeText={setEmail}
                     value={email}/>

                     <Button title={"Sign Up"} onPress={submit} loading={loading}></Button>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <Pressable onPress={()=>router.push('/Login')}>
                        <Text style={[styles.footerText,{color:theme.colors.primaryDark,fontWeight:'600'}]}>Login</Text>
                    </Pressable>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap:45,
        paddingHorizontal:wp(5)   
    },
    welcomeText:{
        fontSize:hp(4),
        fontWeight:'700',
        color:theme.colors.text
    },
    form:{
        gap:25,
    },
    forgotPassword:{
        textAlign:'right',
        fontWeight:'700',
        color:theme.colors.text,
    },
    footer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        gap:5,
    },
    footerText:{
        textAlign:'center',
        fontSize:hp(1.6),
        color:theme.colors.text
    }
})