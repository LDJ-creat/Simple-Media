import { View, Text, Alert,StyleSheet} from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { useRouter } from 'expo-router';
import BackButton from '@/components/BackButton';
import { StatusBar } from 'expo-status-bar';
import Input from '@/components/Input';
import Icon from '@/assets/icons';
import Button from '@/components/Button';
import { HandleResetPassword, HandleVerifyCode, resetPasswordData } from '@/services/getUserData';
import { hp,wp } from '@/helper/common'
const resetPassword = () => {
    const router=useRouter();
    const[email, setEmail]=useState('');
    const[loading, setLoading]=useState(false);
    const[code, setCode]=useState('');
    const[password, setPassword]=useState('');
    const[confirmPassword, setConfirmPassword]=useState('');
    const[verificationCodeSent, setVerificationCodeSent]=useState(false);

    const getVerificationCode=async()=>{
        if(verificationCodeSent){
            Alert.alert('Please wait 1 minutes before requesting a new code');
            return;
        }
        // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!email){
            Alert.alert('Please enter a valid email');
            return;
        }
        // setLoading(true);
        //发送验证码
        await HandleVerifyCode(email);
        setVerificationCodeSent(true);
        // setLoading(false);
        const interval=setInterval(()=>{
            setVerificationCodeSent(false);
        },1000*60);//1分钟后可以再次获取
        //组件卸载时删除定时器
        return ()=>clearInterval(interval);
    }
    const submit=async()=>{
        if(!email.trim()){
            Alert.alert('Email is required');
            return;
        }
        if(!code.trim()){
            Alert.alert('Please enter a valid code');
            return;
        }
        if(!password.trim()||!confirmPassword.trim()){
            Alert.alert('Please enter a valid password');
            return;
        }
        if(password!==confirmPassword){
            Alert.alert('Passwords do not match');
            return;
        }
        // setLoading(true);
        let resetPasswordData:resetPasswordData={
            Email:email,
            Code:code,
            NewPassword:password
        }

        await HandleResetPassword(resetPasswordData);
        setLoading(false);
    }
  return (
    <ScreenWrapper bg="white">
        <StatusBar style="dark"/>
        <View style={styles.container}>
            <BackButton router={router}/>
            <Text style={styles.title}>Reset Password</Text>
            <View style={styles.form}>
                <Text>
                    Please enter your email to reset your password
                </Text>
                <Input
                    placeholder='Enter your email'
                    icon={<Icon name='email' size={26} strokeWidth={1.5}/>}
                    value={email}
                    onChangeText={setEmail}
                />
                <Button
                    title={verificationCodeSent?"Resend Code":"Get Code"}
                    disabled={verificationCodeSent}
                    onPress={getVerificationCode}
                    loading={loading}
                    buttonStyle={styles.button}
                />
                <Input
                    placeholder='enter verification code'
                    icon={<Icon name='lock' size={26} strokeWidth={1.5}/>}
                    value={code}
                    onChangeText={setCode}
                />
                <Input
                    placeholder='Enter your new password'
                    icon={<Icon name='lock' size={26} strokeWidth={1.5}/>}
                    value={password}
                    onChangeText={setPassword}
                />
                <Input
                    placeholder='confirm new password'
                    icon={<Icon name='lock' size={26} strokeWidth={1.5}/>}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <Button
                    title="Reset Password"
                    onPress={submit}
                    loading={loading}
                    buttonStyle={styles.submit}
                />
                
            </View>
        </View>
    </ScreenWrapper>
  )
}

export default resetPassword
const styles=StyleSheet.create({
    container:{
        flex:1,
        padding:20
    },
    title:{
        fontSize:24,
        fontWeight:'bold',
        marginBottom:20
    },
    form:{
        gap:25
    },

    button:{
        marginTop:10,
        backgroundColor:'black',
        borderColor:'black',
        height:40,
    },
    submit:{
        height: hp(6.2),
        width: wp(90),
        alignSelf: 'center',
        // marginBottom:10,
        marginTop:20,

    }
})
