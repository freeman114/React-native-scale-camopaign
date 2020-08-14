import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  AsyncStorage,
  ActivityIndicator,
  Text
} from 'react-native';
import { AsyncSelect } from './AsyncSelect';
import { IUser } from '../../../api/user';
import { changeToken } from '../../../api/auth';
import { StorageTokenKey } from '../../../api';
import NavigationNames from '../../../navigations/NavigationNames';
import { useNavigation } from '@react-navigation/native';

export const ChangeUserScreen: React.FC = () => {
  const navigation = useNavigation();
  const [ loading, setLoading ] = useState(false);

  const changeUser = (user: IUser) => {
    setLoading(true);
    changeToken(
      user.id,
      response => {
        setLoading(false);
        AsyncStorage.setItem(StorageTokenKey, response.user.token).then(() => {
          navigation.goBack();
          navigation.navigate(NavigationNames.AccountScreen);
        })
      },
      error => { setLoading(false); alert(error.msg); }
    )
  };

  return (
    <SafeAreaView style={styles.flex1}>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large"/>
          <Text style={{ marginTop: 10 }} >Changing user...</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <AsyncSelect onSelect={changeUser}/>
        </View>
      ) }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  flex1: { flex: 1 },
  loader: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' },
  scrollContainer: { paddingVertical: 16, paddingHorizontal: 16 },
  text: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
});
