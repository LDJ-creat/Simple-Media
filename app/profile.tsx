import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Header from '@/components/Header'
import { wp ,hp} from '@/helper/common'
import { theme } from '@/constants/theme'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from '@/assets/icons'
import { useRouter, Router } from 'expo-router'
import Avatar from '@/components/Avatar'
import { userData,getUserData } from '@/services/getUserData'
import { useUser } from '@/store/useUser'

const UserHeader = ({user,router, handleLogout}: { user:userData,router: Router, handleLogout: () => void }) => {
  
  return (
      <View style={{flex:1,backgroundColor:'white',paddingHorizontal:wp(4)}}>
        <View>
          <Header title={"Profile"} showBackButton={true} mb={30}/>
          <TouchableOpacity>
            <Icon name="logout" color={theme.colors.rose} onPress={handleLogout}/>
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <View style={{gap:15}}>
            <View style={styles.avatarContainer}>
              <Avatar
                uri={user?.avatar || ""}
                size={hp(12)}
                rounded={theme.radius.xxl*1.4}
              />
              <Pressable style={styles.editIcon} onPress={()=>router.push('./editProfile')}>
                <Icon name="edit" strokeWidth={2.5} size={20}/>
              </Pressable>
            </View>

            <View style={{alignItems:'center',gap:4}}>
              <Text style={styles.userName}>{user?.userName}</Text>
            </View>

            <View style={{gap:10}}>
              <View style={styles.info}>
                <Icon name="email" size={20} color={theme.colors.textLight}/>
                <Text style={styles.infoText}>{user?.email}</Text>
              </View>
              <View style={styles.info}>
                <Icon name="phone" size={20} color={theme.colors.textLight}/>
                <Text style={styles.infoText}>{user?.phone}</Text>
              </View>
              <View style={styles.info}>
                <Icon name="signature" size={20} color={theme.colors.textLight}/>
                <Text style={styles.infoText}>{user?.signature}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
  )
}

const profile = () => {
  const router = useRouter();
  const setUser = useUser(state => state.setUser);
  const userData = getUserData();
  useEffect(() => {
    setUser(userData);
  }, []);

  const Logout = () => {
    router.push('/Login')
  }
  const handleLogout = async () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to log out",
      [
        {
          text: "Cancel",
          onPress: () => console.log("modal canceled"),
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => Logout(),
          style: "destructive"
        }
      ]
    );
  }
  return (
    <ScreenWrapper bg="white">
      <UserHeader user={userData} handleLogout={handleLogout} router={router} />
    </ScreenWrapper>
  )
}

export default profile

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  headerContainer:{
    marginHorizontal:wp(4),
    marginBottom:20,
  },
  headerShape:{
    width:wp(100),
    height:hp(20),
  },
  avatarContainer:{
    height:hp(12),
    width:hp(12),
    alignSelf:'center',
  },
  editIcon:{
    position:'absolute',
    bottom:0,
    right:-12,
    padding:7,
    borderRadius:50,
    backgroundColor:theme.colors.textLight,
    shadowOffset:{width:0,height:4},
    shadowOpacity:0.4,
    shadowRadius:5,
    elevation:7
  },
  userName:{
    fontSize:hp(3),
    fontWeight:'500',
    color:theme.colors.textDark,
    textAlign:'center',
  },
  info:{
    gap:10,
  },
  infoText:{
    fontSize:hp(1.6),
    fontWeight:'500',
    color:theme.colors.textLight,
  },
  logoutButton:{
    position:'absolute',
    right:0,
    padding:5,
    borderRadius:theme.radius.sm,
    backgroundColor:'#fee2e2',
  },
  listStyle:{
    paddingHorizontal:wp(4),
    paddingBottom:30,
  },
  noPosts:{
    fontSize:hp(2),
    textAlign:'center',
    color:theme.colors.text,
  }
})