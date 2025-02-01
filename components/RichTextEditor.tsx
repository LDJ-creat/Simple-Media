import { StyleSheet, Text, View } from 'react-native'
import React, { RefObject } from 'react'
import {RichToolbar,actions,RichEditor} from 'react-native-pell-rich-editor'
import {theme} from '@/constants/theme'

interface Props {
  editorRef: RefObject<RichEditor>
  onChange: (text: string) => void
}

const RichTextEditor = ({editorRef,onChange}: Props) => {
  return (
    <View>
      <RichToolbar
        actions={[
          actions.setStrikethrough,
          actions.removeFormat,
          actions.setBold,
          actions.setItalic,
          actions.insertOrderedList,
          actions.blockquote,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
          actions.code,
          actions.line,
          actions.heading1,
          actions.heading4,//自定义图标
        ]}
        //自定义图标
        iconMap={{
          [actions.heading1]:({tintColor}: {tintColor: string})=><Text style={{color:tintColor}}>H1</Text>,
          [actions.heading4]:({tintColor}: {tintColor: string})=><Text style={{color:tintColor}}>H4</Text>
        }}
        style={styles.richBar}
        flatContainerStyle={styles.flatStyle}
        selectedIconTint={theme.colors.primaryDark}
        editor={editorRef}
        disabled={false}
      />

      <RichEditor
        ref={editorRef}
        containerStyle={styles.rich}
        editorStyle={styles.contentStyle}
        placeholder={"What's on your mind"}
        onChange={onChange}
      />
    </View>
  )
}

export default RichTextEditor

const styles = StyleSheet.create({
  richBar:{
    borderTopRightRadius:theme.radius.xl,
    borderTopLeftRadius:theme.radius.xl,
    backgroundColor:theme.colors.gray

  },
  rich:{
    minHeight:240,
    flex:1,
    borderWidth:1.5,
    borderTopWidth:0,
    borderBottomLeftRadius:theme.radius.xl,
    borderBottomRightRadius:theme.radius.xl,
    backgroundColor:theme.colors.gray,
    padding:5,
  },
  contentStyle:{
    color:theme.colors.textDark
  },
  flatStyle:{
    paddingHorizontal:8,
    gap:12,
  }

})