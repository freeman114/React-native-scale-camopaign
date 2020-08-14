import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { theme } from './theme';
import PasswordInputText from 'react-native-hide-show-password-input';

export const TextInput = ({ errorText, ...props }) => (
  <View style={styles.container}>
    <TextField
      style={styles.input}
      selectionColor={theme.colors.primary}
      underlineColor="transparent"
      mode="outlined"
      inputContainerStyle={{ backgroundColor: 'white' }}
      {...props}
    />
  </View>
);

export const PasswordInput = ({ errorText, ...props }) => (
  <View style={styles.container}>
    <PasswordInputText
      label={null}
      style={styles.input}
      selectionColor={theme.colors.primary}
      underlineColor="transparent"
      mode="outlined"
      {...props}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    backgroundColor: theme.colors.surface,
    fontSize: 13
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});
