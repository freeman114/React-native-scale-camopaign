import React, { useRef, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Keyboard,
  Text,
} from 'react-native';
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { Button } from '../../../components/buttons/Button';

interface EditorProps {
  onChange(html): void;
  placeholder?: string;
}

const Editor: React.FC<EditorProps> = (props) => {
  const { onChange, placeholder } = props;
  const richtext = useRef();
  const [ keyboardVisible, setKeyboardVisible ] = useState(false);

  const onKeyBoard = () => {
    setKeyboardVisible(true);
  };

  const onKeyBoardHide = () => {
    setKeyboardVisible(false);
  };

  const onDone = () => {
    // @ts-ignore
    richtext.current.blurContentEditor();
    Keyboard.dismiss();
  };

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', onKeyBoard);
    Keyboard.addListener('keyboardDidHide', onKeyBoardHide);
    return () => {
      Keyboard.removeListener('keyboardDidShow', onKeyBoard);
      Keyboard.removeListener('keyboardDidHide', onKeyBoardHide);
    }
  }, []);

  // @ts-ignore
  // @ts-ignore
  return (
    <SafeAreaView style={[ styles.container ]}>
      <ScrollView style={[ styles.scroll ]}>
        <RichEditor
          onHeightChange={() => {}}
          onChange={onChange as any}
          style={[ styles.rich ]}
          ref={richtext}
          placeholder={placeholder || 'Start typing here...'}
          editorInitializedCallback={() => {}}
        />
      </ScrollView>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {keyboardVisible ? <Button
          title="Done"
          type="outline"
          onPress={onDone}
        /> : null}
        <RichToolbar
          style={[ styles.richBar, keyboardVisible && Platform.OS === 'ios' ? styles.richBarMargin : []]}
          getEditor={() => richtext.current}
          actions={[
            'bold',
            'italic',
            'unorderedList',
            'orderedList',
            'link',
            'heading1',
            'heading2',
            'heading3',
            'heading4',
          ]}
          iconMap={{
            heading1: () => (
              <Text style={[styles.tib]}>H1</Text>
            ),
            heading2: () => (
              <Text style={[styles.tib]}>H2</Text>
            ),
            heading3: () => (
              <Text style={[styles.tib]}>H3</Text>
            ),
            heading4: () => (
              <Text style={[styles.tib]}>H4</Text>
            ),
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'column'
  },
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  rich: {
    minHeight: 300,
    flex: 1,
  },
  richBarMargin: {
    marginBottom: 70
  },
  richBar: {
    height: 50,
    backgroundColor: '#F5FCFF',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  tib: {
    textAlign: 'center',
    color: '#848E95',
    fontSize: 19
  },
});

export default Editor;