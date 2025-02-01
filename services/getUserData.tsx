export interface userData{
    userName:string,
    avatar:string
    email:string
    phone:string
    signature:string
}

export const getUserData=()=>{
    let userData: userData = {
        userName: '',
        avatar:'',
        email: '',
        phone:'',
        signature:''
      }
      //用useEffect获取用户信息
    const  getData=()=>{
    
    }
    return userData
}