// 这段代码是一个用于响应式布局的工具函数集合，主要用于在React Native中处理尺寸的计算。
import {Dimensions} from "react-native";
const {width:deviceWidth,height:deviceHeight} = Dimensions.get("window");
const hp = (percentage: number) => {
    return (deviceHeight*percentage)/100;
}
const wp = (percentage: number) => {
    return (deviceWidth*percentage)/100;
}
export {hp,wp,deviceWidth,deviceHeight};

export const stripHtmlTags=(html:string)=>{
    return html.replace(/<[^>]*>?/g, '');
}
