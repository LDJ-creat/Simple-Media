export interface Post{
    body:string,
    image:string[],
    video:string[],
    
}
export interface getPost{
    userName:string,
    avatar:string,
    create_at:string,
    post:Post,
}
export const createOrUpdatePost =async (post:Post)=>{
    try{

    }catch(error){

    }
}

export const getPosts =async ()=>{
    try{

    }catch(error){
        console.log(error)
    }
}
