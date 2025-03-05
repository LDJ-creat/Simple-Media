import { StyleSheet, Text, TouchableOpacity, View ,Alert} from 'react-native'
import React from 'react'
import {theme} from '@/constants/theme'
import {hp} from '@/helper/common'
import Avatar from '@/components/Avatar'
import { commentsData } from '@/services/postServices'
import moment from 'moment'
import Icon from '@/assets/icons'

interface CommentItemProps {
    item: commentsData;
    canDelete: boolean;
    onDelete:()=>{}
    highLight:boolean
}

const CommentItem: React.FC<CommentItemProps> = ({item, canDelete,onDelete,highLight}) => {
  const createAt=moment(item?.CreatedAt).format('YYYY-MM-DD HH:mm:ss')


  const handleDelete=()=>{
    Alert.alert('Confirm',"Are you sure you want to delete this comment?",[
        {
            text:'Cancel',
            onPress:()=>console.log("modal canceled"),
            style:'cancel'

        },
        {
          text:"Delete",
          onPress:()=>onDelete(),
          style:'destructive'
        }
    ])
}

  return (
    <View  style={[styles.container,highLight&&styles.highLight]}>
      <Avatar
          uri={item?.User?.Avatar||""}
      />
      <View style={styles.content}>
        <View style={{flexDirection:'row',alignItems:'center',gap:3,justifyContent:'space-between'}}>
          <View style={styles.nameContainer}>
            <Text style={styles.text}>{item?.Username}</Text>
            <Text>·</Text>
            <Text style={[styles.text,{color:theme.colors.textLight}]}>{createAt}</Text>
          </View>
          {
              canDelete&&(
                <TouchableOpacity onPress={handleDelete}>
                  <Icon name='delete' size={20} color={theme.colors.rose}/>
                </TouchableOpacity>)
          }
        </View>
        <Text style={styles.text}>{item?.Content}</Text>
      </View>


    </View>




  )
}

export default CommentItem


const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        gap:7,
    },
    content:{
        backgroundColor:'rgba(0,0,0,0.06)',
        flex:1,
        gap:5,
        paddingHorizontal:14,
        paddingVertical:10,
        borderRadius:theme.radius.md,
        borderCurve:'continuous',
    },
    highLight:{
        borderWidth:0.2,
        backgroundColor:"white",
        borderColor:theme.colors.dark,
        shadowColor:theme.colors.dark,
    },
    nameContainer:{
        flexDirection:'row',
        alignItems:'center',
        gap:3,
    },
    text:{
        fontSize:hp(1.6),
        fontWeight:'600',
        color:theme.colors.textDark,
    }

})