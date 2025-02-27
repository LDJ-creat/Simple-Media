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
import { HandleLogin } from '@/services/getUserData'
import { useUser } from '@/store/useUser'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Login = () => {
    const router = useRouter();
    // const emailRef = useRef<TextInput>(null);
    // const passwordRef = useRef<TextInput>(null);
    const[loading, setLoading] = useState(false);
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const setUser=useUser(state=>state.setUser)
    const submit=async ()=>{
        if(!email.trim() || !password.trim()){
            Alert.alert('Please fill all fields')
            return;
        }
        setLoading(true)
        const loginData={
            email:email,
            password:password
        }

        const response=await  HandleLogin(loginData)
        setUser(response.userData)
        AsyncStorage.setItem('token',response.token)
        setLoading(false)
        setEmail('')
        setPassword('')
    }   
    return (
        <ScreenWrapper bg="white">
            <StatusBar style="dark"/>
            <View style={styles.container}>
                <BackButton router={router}/>
                <View>
                    <Text style={styles.welcomeText}>Hey,</Text>
                    <Text style={styles.welcomeText}>Welcome Back</Text>
                </View>
                <View style={styles.form}>
                    <Text>
                        Please login to continue
                    </Text>
                    <Input placeholder='Enter your email'
                     icon={<Icon name='email' size={26} strokeWidth={1.5}/>}
                     onChangeText={setPassword}
                     value={password}/>

                    <Input placeholder='Enter your password'
                     icon={<Icon name='lock' size={26} strokeWidth={1.5}/>}
                     secureTextEntry={true}
                     onChangeText={setEmail}
                     value={email}/>

                     <Text style={styles.forgotPassword}>Forgot Password?</Text>
                     <Button title={"Login"} onPress={submit} loading={loading}></Button>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account?</Text>
                    <Pressable onPress={()=>router.push('/SignUp')}>
                        <Text style={[styles.footerText,{color:theme.colors.primaryDark,fontWeight:'600'}]}>Sign Up</Text>
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