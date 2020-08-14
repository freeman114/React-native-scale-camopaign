import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Divider, TouchableHighlight } from "../../components";
import { Theme } from "../../theme";
import { useLocalization } from "../../localization";
import { SettingsBottomSheet } from "../../modals";
import NavigationNames from "../../navigations/NavigationNames";
import { useNavigation } from "@react-navigation/native";
import { apiGetUserRequest, IUser } from '../../api/user';

const getSettingsItems = (getString: (key: string) => string) => [
  {
    title: getString("Signature"),
    iconName: "md-settings",
    navigateToScreen: NavigationNames.SignatureSettingsScreen
  },
  {
    title: getString("Location"),
    iconName: "md-settings",
    navigateToScreen: NavigationNames.LocationSettingsScreen
  },
  {
    title: getString("Change User"),
    iconName: "md-settings",
    navigateToScreen: NavigationNames.ChangeUserScreen,
    roles: ['scale_campaign']
  },
];

type TProps = {};

export const SettingsScreen: React.FC<TProps> = props => {
  const navigation = useNavigation();
  const { getString } = useLocalization();

  const [isVisibleSettingModal, setIsVisibleSettingModal] = useState(false);
  const [ user, setUser ] = useState<IUser>(null);
  const menuItems = getSettingsItems(getString);

  const onPressMenuItemClick = (item: any) => {
    if (item.navigateToScreen) {
      navigation.navigate(item.navigateToScreen);
    }
  };

  useEffect(() => {
    apiGetUserRequest((response) => {
      setUser(response);
    });
  }, []);

  return (
    <>
      <FlatList
        data={menuItems}
        keyExtractor={(item, index) => `key${index}ForMenu`}
        renderItem={({ item }) => {
          if (item.roles) {
            if (!(user && item.roles.includes(user.role))) {
              return null;
            }
          }
          return (
            <TouchableHighlight onPress={() => onPressMenuItemClick(item)}>
              <View style={styles.itemContainer}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={item.iconName}
                    size={24}
                    color={Theme.colors.gray}
                    style={styles.icon}
                  />
                </View>
                <Text style={styles.titleText}>{item.title}</Text>
                <Ionicons
                  name="ios-arrow-forward"
                  size={24}
                  color={Theme.colors.gray}
                />
              </View>
            </TouchableHighlight>
          )
        }}
        ItemSeparatorComponent={() => <Divider />}
      />
      <SettingsBottomSheet
        isVisible={isVisibleSettingModal}
        onDismissModal={() => setIsVisibleSettingModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex1: {
    flex: 1
  },
  itemContainer: {
    flexDirection: "row",
    paddingVertical: 18,
    paddingEnd: 18,
    paddingStart: 0
  },
  iconContainer: {
    width: 60,
    alignSelf: "center"
  },
  icon: { alignSelf: "center" },
  titleText: {
    flex: 1,
    alignSelf: "center",
    color: Theme.colors.black,
    fontSize: 17
  }
});
