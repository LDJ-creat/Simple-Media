import api from "@/services/api"

export interface userData{
    userID:string,
    userName:string,
    avatar:string,
    email:string
    phone:string
    signature:string
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
    userName:string,
    email:string,
    password:string
}
export const HandleSignUp=async (signUpData:signUpData)=>{
    const response=await api.post('/register',signUpData)
    return response.data
}
