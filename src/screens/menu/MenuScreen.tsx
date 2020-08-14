import React, { useState } from "react";
import { FlatList, View, Text, StyleSheet, Alert, Platform, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Divider, TouchableHighlight } from "../../components";
import { Theme } from "../../theme";
import { useLocalization } from "../../localization";
import { SettingsBottomSheet } from "../../modals";
import NavigationNames from "../../navigations/NavigationNames";
import { useNavigation } from "@react-navigation/native";

const getMenuItems = (getString: (key: string) => string) => [
   {
    title: getString("Blog"),
    iconName: "ios-paper",
    navigateToScreen: NavigationNames.BlogScreen
  },
  {
    title: getString("About Us"),
    iconName: "ios-business",
    navigateToScreen: NavigationNames.AboutScreen
  },
  {
    title: getString("Contact Us"),
    iconName: "ios-call",
  },
  {
    title: getString("Write to Us"),
    iconName: "ios-chatbubbles",
    navigateToScreen: NavigationNames.WriteScreen
  },
  {
    title: getString("Settings"),
    iconName: "md-settings",
    navigateToScreen: NavigationNames.SettingsScreen
  }
];

type TProps = {};

export const MenuScreen: React.FC<TProps> = props => {
  const navigation = useNavigation();
  const { getString } = useLocalization();

  const [isVisibleSettingModal, setIsVisibleSettingModal] = useState(false);
  const menuItems = getMenuItems(getString);

  const onPressMenuItemClick = (item: any) => {
    if (item.navigateToScreen) {
      navigation.navigate(item.navigateToScreen);
    }
    if (item.title == 'Contact Us'){
      callphone();
    }
  };

  return (
    <>
      <FlatList
        data={menuItems}
        keyExtractor={(item, index) => `key${index}ForMenu`}
        renderItem={({ item }) => (
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
        )}
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

const callphone = () => {
  let number = '';
  if (Platform.OS === 'ios') {
  number = 'telprompt:${+16164394102}';
  }
  else {
  number = 'tel:${+16164394102}'; 
  }
  Linking.openURL(number);
};
