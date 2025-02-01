import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { hp } from '@/helper/common'
import { theme } from '@/constants/theme'
import { useRouter } from 'expo-router'
import BackButton from './BackButton'

interface HeaderProps {
    title: string;
    showBackButton?: boolean;
    mb?: number;
}

const Header = ({ title, showBackButton = false, mb = 10 }: HeaderProps) => {
    const router = useRouter();
    return (
        <View style={[styles.container, { marginBottom: mb }]}>
            {showBackButton && 
            <View style={styles.backButton}>
                <BackButton router={router}/>
            </View>}
            <Text style={styles.title}>{title}</Text>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        gap: 10
    },
    title: {
        fontSize: hp(2.2),
        fontWeight: '600',
        color: theme.colors.text
    },
    backButton:{
        position:'absolute',
        left:0,
    }
})