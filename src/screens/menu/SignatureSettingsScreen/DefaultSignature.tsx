import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import { Sketch  } from 'expo-pixi';
import * as FileSystem from 'expo-file-system';
import { SignatureKey } from '../../../storageKeys';

interface DefaultSignatureProps {
  onScrollChange?(scroll: boolean): void;
  onSignatureChange?(signature: string): void;
  onDefaultSignatureLoaded?(defaultSignature): void;
}

export const DefaultSignature: React.FC<DefaultSignatureProps> = (props) => {
  const signatureRef = useRef(null);
  const { onScrollChange, onSignatureChange, onDefaultSignatureLoaded } = props;
  const [ initialSignature, setSignature ] = useState(null);
  const [ editMode, setEditMode ] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(SignatureKey).then(value => {
      setSignature(value);
      if (value) {
        setEditMode(false);
        onDefaultSignatureLoaded && onDefaultSignatureLoaded(value);
      }
    });
  }, []);

  return (
    <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center'}}>
      {!editMode ? (
        <Image style={styles.image} source={{uri: `data:image/gif;base64,${initialSignature}`}} />
      ) : (
        <Sketch
          style={styles.sketch}
          ref={signatureRef}
          strokeWidth={3}
          strokeAlpha={0.5}
          onChange={async () => {
            onScrollChange && onScrollChange(false);
            const timeoutRef = setTimeout(() => {
              onScrollChange && onScrollChange(true);
              clearTimeout(timeoutRef);
            }, 1800);
            const { uri } = await signatureRef.current.takeSnapshotAsync({
              format: 'png',
            });
            try {
              const signature = await FileSystem.readAsStringAsync(uri, {
                encoding: 'base64',
              });
              onSignatureChange && onSignatureChange(signature);
            } catch (e) {
              console.error(e.message);
            }
          }}
        />
      )}
      {editMode ? (
        <TouchableOpacity onPress={() => signatureRef.current.undo()} style={{ padding: 10 }}>
          <Text style={{ fontSize: 13, color: 'blue' }}>Undo</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => setEditMode(true)} style={{ padding: 10 }}>
          <Text style={{ fontSize: 13, color: 'blue' }}>Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  )
};

const styles = StyleSheet.create({
  sketch: {
    width: '70%',
    height: 150,
    borderColor: 'blue',
    borderWidth: 1,
    margin: 10
  },
  image: {
    width: '70%',
    height: 150,
    borderColor: 'transparent',
    borderWidth: 1,
    margin: 10,
    marginLeft: 0
  }
});