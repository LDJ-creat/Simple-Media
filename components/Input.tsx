import { TextInput, TextInputProps,View } from 'react-native'
import { StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { hp, wp } from '@/helper/common'
import { theme } from '@/constants/theme'

interface InputProps extends TextInputProps {
    icon?: React.ReactNode;
    inputRef?: any;
    containerStyle?: StyleProp<ViewStyle>;
}

const Input = ({...props}: InputProps) => {
  return (
    <View style={[styles.container, props.containerStyle]}>
        {
            props.icon&&props.icon
        }
        <TextInput 
        style={{flex:1}}
        placeholderTextColor={theme.colors.textLight}
        ref={props.inputRef}
        {...props} 
        />
    </View>
  )
}

export default Input
const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        height:hp(7.2),
        alignItems:'center',
        justifyContent:'center',
        borderRadius:theme.radius.xxl,
        borderWidth:0.4,
        borderColor:theme.colors.text,
        borderCurve:'continuous',
        paddingHorizontal:18,
        gap:12
    }
})