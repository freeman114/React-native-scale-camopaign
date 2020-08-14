import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import NavigationNames from '../../navigations/NavigationNames';


const apps = [{
  name: 'Visitors',
}];

export const AppsScreen: React.FC = props => {
  const navigation = useNavigation();

  return (
    <View style={styles.MainContainer}>
      <FlatList
        data={apps}
        renderItem={({ item }) => (
          <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
            <TouchableOpacity onPress={() => navigation.navigate(NavigationNames.VisitorsProjectsScreen)}>
              <View style={styles.cell}>
                <Ionicons name="ios-people" color="#73CEC1" size={60} />
                <Text>{ item.name }</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    paddingTop: 30,
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    width: 100,
  },
});