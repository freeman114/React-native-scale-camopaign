import React, { memo, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { emailValidator } from '../../auth-components/utils';
import Background from '../../auth-components/Background';
import BackButton from '../../auth-components/BackButton';
import Logo from '../../auth-components/Logo';
import Header from '../../auth-components/Header';
import { TextInput } from '../../auth-components/TextInput';
import { theme } from '../../auth-components/theme';
import Button from '../../auth-components/Button';
import NavigationNames from "../../navigations/NavigationNames";
import { useNavigation } from "@react-navigation/native";

const ForgotPasswordScreen = () => {
	const navigation = useNavigation();
  const [email, setEmail] = useState({ value: '', error: '' });

  const _onSendPressed = () => {
    const emailError = emailValidator(email.value);

    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }

    navigation.navigate(NavigationNames.LoginScreen);
  };

  return (
    <ScrollView>
      <Background>
        <BackButton goBack={() => navigation.navigate(NavigationNames.LoginScreen)} />

        <Logo />

        <Header>Restore Password</Header>

        <TextInput
          label="E-mail address"
          returnKeyType="done"
          value={email.value}
          onChangeText={text => setEmail({ value: text, error: '' })}
          error={!!email.error}
          errorText={email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />

        <Button mode="contained" onPress={_onSendPressed} style={styles.button}>
          Send Reset Instructions
        </Button>

        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.navigate(NavigationNames.LoginScreen)}
        >
          <Text style={styles.label}>← Back to login</Text>
        </TouchableOpacity>
      </Background>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  back: {
    width: '100%',
    marginTop: 12,
  },
  button: {
    marginTop: 12,
  },
  label: {
    color: theme.colors.secondary,
    width: '100%',
  },
});

export default memo(ForgotPasswordScreen);
