import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage'
import { DefaultSignature } from './DefaultSignature';
import { SignatureKey } from '../../../storageKeys';

export const SignatureSettingsScreen: React.FC = () => {
  const onSignatureChange = (value) => {
    AsyncStorage.setItem(SignatureKey, value);
  };

  return (
    <SafeAreaView style={styles.flex1}>
      <View style={styles.container}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Signature</Text>
        <DefaultSignature
          onSignatureChange={onSignatureChange}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  container: { paddingVertical: 16, paddingHorizontal: 16 },
  sketch: {
    width: '70%',
    height: 150,
    borderColor: 'blue',
    borderWidth: 1,
    margin: 10
  }
});
