import api from "@/services/api"
import { Toast } from "@ant-design/react-native";
import { router } from "expo-router";
import { Alert } from "react-native";

export interface userData {
    ID: number,
    Username: string,
    Avatar: string,
    Email: string,
    Phone: string,
    Signature: string,
    CreatedAt: string,
    UpdatedAt: string,
    DeletedAt: null | string
}

export interface loginData{
    email:string,
    password:string
}
export const HandleLogin=async (loginData:loginData)=>{
    const response=await api.post('/login',loginData)
    return response.data
}

export interface signUpData{
    username:string,
    password:string,
    email:string
}
export const HandleSignUp=async (signUpData:signUpData)=>{
    console.log('开始注册流程');
    try {
        console.log('1. 发送注册请求，数据:', JSON.stringify(signUpData, null, 2));
        
        const response = await api.post('/register', signUpData);
        console.log('2. 收到原始响应:', response);
        console.log('3. 响应状态:', response?.status);
        console.log('4. 响应数据:', response?.data);
        
        if (!response) {
            console.log('5a. 响应对象为空');
            throw new Error('响应对象为空');
        }
        
        if (!response.data) {
            console.log('5b. 响应数据为空');
            throw new Error('服务器返回数据为空');
        }

        console.log('6. 注册成功，完整返回数据:', JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error: any) {
        console.log('7. 捕获到错误');
        if (error.response) {
            console.error('8a. 服务器响应错误:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
        } else if (error.request) {
            console.error('8b. 请求错误:', error.request);
        } else {
            console.error('8c. 其他错误:', error.message);
        }
        throw error;
    }
}

export const HandleVerifyCode=async (Email:String)=>{
    try{
        // 方式一：将Email作为查询参数
        const response = await api.get("/code", {
            params: {
                email: Email
            }
        });
        console.log(response.data)
        if(response.data.status==="success"){
            Toast.success('Verification code sent successfully',1);
        }
    }catch(error:any){

        Alert.alert('Failed to send verification code',error.response.data.message);
        throw error

    }

}

export interface resetPasswordData{
    Email:string,
    Code:string,
    NewPassword:string
}
export const HandleResetPassword=async (resetPasswordData:resetPasswordData)=>{
    try{
        const response=await api.put("/password",resetPasswordData)
        console.log(response.data)
        if(response.data.status==="success"){
            Toast.success('Password reset successfully',1);
        }
        router.push('/Login')
    }catch(error:any){
        // 使用后端返回的具体错误信息
        const errorMessage = error.response?.data?.error || '密码重置失败';
        Alert.alert('Failed to reset password',errorMessage);
        throw error
    }
}
