import React, {memo, useState} from 'react';
import {TouchableOpacity, StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import {useNavigation} from '@react-navigation/native';
import Background from '../../auth-components/Background';
import Logo from '../../auth-components/Logo';
import Button from '../../auth-components/Button';
import {TextInput, PasswordInput} from '../../auth-components/TextInput';
import {theme} from '../../auth-components/theme';
import {emailValidator, passwordValidator} from '../../auth-components/utils';
import NavigationNames from "../../navigations/NavigationNames";
import {apiGetTokenRequest} from "../../api/auth";
import {StorageTokenKey} from "../../api";
import { ScrollView } from 'react-native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});
  const [loading, setLoading] = useState(false);

  const _onLoginPressed = () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({...email, error: emailError});
      setPassword({...password, error: passwordError});
      return;
    }

    setLoading(true);

    apiGetTokenRequest(
      email.value,
      password.value,
      (token) => {
        setLoading(false);
        AsyncStorage.setItem(StorageTokenKey, token).then(() => navigation.replace(NavigationNames.HomePageTabScreen));
      },
      (error) => {
        setLoading(false);
        setPassword({...password, error: error.msg});
        setEmail({...email, error: error.msg});
      }
    );
  };

  return (
    <ScrollView>
      <Background>

        <Logo/>
        <TextInput
          title="Email"
          returnKeyType="next"
          value={email.value}
          onChangeText={text => setEmail({value: text, error: ''})}
          error={email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />

        <PasswordInput
          title="Password"
          returnKeyType="done"
          value={password.value}
          onChangeText={text => setPassword({value: text, error: ''})}
          error={password.error}
          secureTextEntry
        />

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large"/>
          </View>
        ) : null}

        <View style={styles.forgotPassword}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPasswordScreen')}
          >
            <Text style={styles.label}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>

        <Button mode="contained" disabled={loading} onPress={_onLoginPressed}>
          Login
        </Button>

        <View style={styles.row}>
          <Text style={styles.label}>Don’t have an account?</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.link}>Contact administrator at your organization.</Text>
        </View>
      </Background>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  loader: {
    marginVertical: 10,
    display: 'flex',
    justifyContent: 'center'
  }
});

export default memo(LoginScreen);
