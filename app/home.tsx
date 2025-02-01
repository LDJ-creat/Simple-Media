import { StyleSheet, Text, View,Alert,Button,Pressable } from 'react-native'
import ScreenWrapper from '@/components/ScreenWrapper'
import {theme} from '@/constants/theme'
import {hp,wp} from '@/helper/common'
import Icon from  '@/assets/icons'
import React from 'react'
import {useRouter} from 'expo-router'
import Avatar from '@/components/Avatar'

const home = () => {
    const router = useRouter()
//     const Logout = () => {
//         router.push('/Login')
//     }
//     const handleLogout = async () => {
//     Alert.alert(
//       "Confirm",
//       "Are you sure you want to log out",
//       [
//         {
//           text: "Cancel",
//           onPress: () => console.log("modal canceled"),
//           style: "cancel"
//         },
//         {
//           text: "Logout",
//           onPress: () => Logout(),
//           style: "destructive"
//         }
//       ]
//     );
//   }

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>LinkUp</Text>

          <View style={styles.icons}>
            <Pressable onPress={()=>router.push('./notification')}>
                <Icon name="heart" size={hp(3.2)} strokeWidth={2} color={theme.colors.text}/>
            </Pressable>
            <Pressable onPress={()=>router.push('./newPost')}>
                <Icon name="plus" size={hp(3.2)} strokeWidth={2} color={theme.colors.text}/>
            </Pressable>
            <Pressable onPress={()=>router.push('./profile')}>
                <Avatar 
                uri=''//后续替换成向后端请求的数据，无设置则为空
                size={hp(4.5)}
                rounded={theme.radius.sm}
                style={{borderWidth:2}}/>
            </Pressable>
          </View>
        </View>
      </View>
      {/* <Button title="logout" onPress={handleLogout}></Button> */}
    </ScreenWrapper>
  )
}

export default home

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    header:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginHorizontal:wp(4),
        marginBottom:10,
    },
    title:{
        color:theme.colors.text,
        fontSize:hp(3.2),
        fontWeight:'700',
    },
    avatarImage:{
        width:hp(4.3),
        height:hp(4.3),
        borderRadius:theme.radius.sm,
        borderWidth:3,
        borderColor:theme.colors.gray,
    },
    icons:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        gap:18,
    },
    listStyle:{
        paddingTop:20,
        paddingHorizontal:wp(4),
    },
    noPosts:{
        fontSize:hp(2),
        textAlign:'center',
        color:theme.colors.text,
    },
    pill:{
        position:'absolute',
        right:-10,
        top:-4,
        height:hp(2.2),
        width:hp(2.2),
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:theme.colors.roseLight,
        borderRadius:20,
    },
    pillText:{
        color:"white",
        fontSize:hp(1.2),
        fontWeight:'700',
    }
})