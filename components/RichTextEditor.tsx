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
    <View style={styles.container}>
      <RichToolbar
        editor={editorRef}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.heading1,
          actions.heading2,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
        ]}
        iconMap={{
          [actions.heading1]: ({tintColor}: {tintColor: string}) => (
            <Text style={[styles.tib, {color: tintColor}]}>H1</Text>
          ),
          [actions.heading2]: ({tintColor}: {tintColor: string}) => (
            <Text style={[styles.tib, {color: tintColor}]}>H2</Text>
          ),
        }}
        style={styles.richBar}
        flatContainerStyle={styles.flatStyle}
        selectedIconTint={theme.colors.primaryDark}
      />

      <RichEditor
        ref={editorRef}
        initialContentHTML={`<p></p>`}
        containerStyle={styles.rich}
        style={styles.editor}
        editorInitializedCallback={() => console.log('Editor initialized')}
        placeholder={"What's on your mind"}
        onChange={onChange}
        initialHeight={200}
        editorStyle={{
          contentCSSText: `
            * {
              font-family: sans-serif;
              color: ${theme.colors.textDark};
            }
            body {
              background-color: transparent;
              padding: 10px;
            }
          `
        }}
      />
    </View>
  )
}

export default RichTextEditor

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  richBar: {
    borderTopRightRadius: theme.radius.xl,
    borderTopLeftRadius: theme.radius.xl,
    backgroundColor: theme.colors.gray
  },
  rich: {
    minHeight: 200,
    flex: 1,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
    backgroundColor: theme.colors.gray,
  },
  editor: {
    flex: 1,
  },
  flatStyle: {
    paddingHorizontal: 8,
    gap: 12,
  },
  tib: {
    textAlign: 'center',
    fontSize: 16,
  }
})