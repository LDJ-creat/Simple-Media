export interface userData{
    userID:string,
    userName:string,
    avatar:string,
    email:string
    phone:string
    signature:string
}


export const getUserData=()=>{
    let userData: userData = {
        userID: '',
        userName: '',
        avatar: '',
        email: '',
        phone:'',
        signature:''
      }

    const  getData=()=>{
    
    }
    return userData
}