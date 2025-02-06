import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import home from './home'
import arrowLeft from './arrowLeft'
import email from './email'
import lock from './lock'
import user from './user'
import heart from './heart'
import plus from './plus'
import logout from './logout'
import edit from './edit'
import phone from './phone'
import camera from './camera'
import signature from './signature'
import Image from '@/assets/icons/image'
import video from '@/assets/icons/video'
import deleteIcon from '@/assets/icons/delete'
import dotsHorizontal from './dotsHorizontal'
import comment from "@/assets/icons/comment"
import share from '@/assets/icons/share'
import reload from '@/assets/icons/reload'
import send from '@/assets/icons/send'
import { theme } from '../../constants/theme'
import { SvgProps } from 'react-native-svg'

interface IconProps extends SvgProps {
    name: keyof typeof icons;
    size?: number;
    strokeWidth?: number;
}

const icons = {
    home: home,
    arrowLeft: arrowLeft,
    email: email,
    lock: lock,
    user: user,
    heart: heart,
    plus: plus,
    logout: logout,
    edit:edit,
    phone:phone,
    signature:signature,
    camera:camera,
    Image:Image,
    video:video,
    delete:deleteIcon,
    dotsHorizontal:dotsHorizontal,
    comment:comment,
    share:share,
    reload:reload,
    send:send,
}

const Icon = ({name, ...props}: IconProps) => {
    const IconComponent = icons[name];
    return (
        <IconComponent
            {...props}
            height={props.size || 24}
            width={props.size || 24}
            strokeWidth={props.strokeWidth || 1.9}
            color={props.color || theme.colors.textLight}
        />
    )
}

export default Icon
const styles = StyleSheet.create({})