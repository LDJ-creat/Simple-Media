// 这是一个通用的屏幕包装器组件（ScreenWrapper），主要用于为React Native应用提供一致的屏幕布局结构
import { View } from "react-native";
import React, { ReactNode } from "react";
import {useSafeAreaInsets} from 'react-native-safe-area-context'

interface ScreenWrapperProps {
    children: ReactNode;
    bg: string;
}

const ScreenWrapper = ({ children, bg }: ScreenWrapperProps) => {
    const {top}=useSafeAreaInsets();
    const paddingTop=top>0?top+5:30;
    return(
        <View style={{flex:1,paddingTop,backgroundColor:bg}}>
            {children}
        </View>
    )
}
export default ScreenWrapper;