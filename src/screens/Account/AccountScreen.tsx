import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  Avatar,
  Divider,
} from '../../components';
import { Theme } from '../../theme';
import { useLocalization } from '../../localization';
import { apiGetUserRequest, IUser } from '../../api/user';
import { Button } from '../../components/buttons/Button';
import { useNavigation } from '@react-navigation/native';
import NavigationNames from '../../navigations/NavigationNames';
import { StorageTokenKey } from '../../api';
import AsyncStorage from '@react-native-community/async-storage'

type TProps = {};

export const AccountScreen: React.FC<TProps> = (props) => {
  const { getString } = useLocalization();
  const [user, setUser] = useState<IUser>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const listener = navigation.addListener(
      'focus',
      () => {
        apiGetUserRequest((response) => {
          setUser(response);
        });
      },
    );

    return () => navigation.removeListener('focus', listener);
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem(StorageTokenKey);
    navigation.navigate(NavigationNames.LoginScreen);
  };

  const moreitem = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53a6hj28ba',
      title: 'Rate App',
    },
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'Privacy Policy',
      navigateToScreen: NavigationNames.PrivacyScreen,
    },
    {
      id: '58694a0f-3da1-471f-bd96-1hd45571e29d72',
      title: 'Terms of Service',
      navigateToScreen: NavigationNames.TermsScreen,
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'App Version',
    },
  ];

  const contact = () => {
    navigation.navigate(NavigationNames.WriteScreen);
  };

  const onprofile = () => {
    navigation.navigate(NavigationNames.ProfileScreen);
  };

  const onPressMenuItemClick = (item: any) => {
    if (item.navigateToScreen) {
      return navigation.navigate(item.navigateToScreen);
    }
  };

  return (
    <SafeAreaView style={styles.flex1}>
      <ScrollView
        style={styles.flex1}
        contentContainerStyle={styles.scrollContainer}
      >
        <Avatar
          firstName={(user && user.first_name) || ''}
          lastName={(user && user.last_name) || ''}
          imageStyle={styles.imageStyle}
        />

        <Text style={styles.nameText}>
          {user && (user.name || user.first_name)}
        </Text>
        <Text style={styles.sectionText}>Organization</Text>
        <View style={styles.separator}>
          <Ionicons
            active
            style={styles.item}
            name="ios-people"
            size={26}
            color="green"
          >
            {'  '}
            {user && user.company_name}
          </Ionicons>
        </View>

        <Text style={styles.sectionText}>Settings</Text>
        <TouchableOpacity onPress={onprofile}>
          <View style={styles.separator}>
            <Ionicons
              active
              style={styles.item}
              name="md-person"
              size={26}
              color="green"
            >
              {'  Profile'}
            </Ionicons>
            <Ionicons
              style={styles.icon}
              name="ios-arrow-forward"
              size={24}
              color={Theme.colors.primaryColor}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.separator}>
            <Ionicons
              active
              style={styles.item}
              name="md-notifications"
              size={26}
              color="green"
            >
              {'  Notifications'}
            </Ionicons>
            <Ionicons
              style={styles.icon}
              name="ios-arrow-forward"
              size={24}
              color={Theme.colors.primaryColor}
            />
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionText}>Support</Text>
        <TouchableOpacity onPress={() => contact()}>
          <View style={styles.separator}>
            <Ionicons
              active
              style={styles.item}
              name="md-contacts"
              size={26}
              color="green"
            >
              {'  Contact Support'}
            </Ionicons>
            <Ionicons
              style={styles.icon}
              name="ios-arrow-forward"
              size={24}
              color={Theme.colors.primaryColor}
            />
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionText}>More</Text>
        <FlatList
          data={moreitem}
          //   renderItem={renderItem}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onPressMenuItemClick(item)}>
              <View style={styles.separator}>
                <Text style={styles.item}>{item.title}</Text>
                <Ionicons
                  style={styles.icon}
                  name="ios-arrow-forward"
                  size={24}
                  color={Theme.colors.primaryColor}
                />
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <Divider />}
        />

        <Button
          title={getString('Log out')}
          type="outline"
          style={{ marginTop: 8, width: '80%', alignSelf: 'center' }}
          onPress={logout}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1 },
  flex1: { flex: 1 },
  scrollContainer: {
    paddingVertical: 16,
    backgroundColor: '#f8f6f8',
  },
  imageStyle: {
    width: 130,
    height: 130,
    borderRadius: 36,
    borderColor: Theme.colors.primaryColor,
    borderWidth: 0.5,
    alignSelf: 'center',
    marginTop: 36,
  },
  nameText: {
    alignSelf: 'center',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 16,
    color: Theme.colors.black,
  },
  sectionText: {
    fontSize: 15,
    marginLeft: '5%',
    marginTop: 20,
    marginBottom: 8,
    color: Theme.colors.black,
  },
  item: {
    backgroundColor: 'white',
    fontSize: 20,
    color: 'black',
    paddingVertical: 10,
    paddingHorizontal: 10,
    flex: 1,
  },

  separator: {
    marginHorizontal: '5%',
    borderWidth: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: '#e9f1f5',
  },

  icon: {
    marginHorizontal: '5%',
    flexDirection: 'row',
    // backgroundColor: "white",

    alignSelf: 'center',
  },
});
