export const getImageUrl = (imagePath: string) => {
    if(imagePath!=""){
        return {uri:imagePath}
    }else{
        return require('@/assets/images/avatar.png')
    }
}