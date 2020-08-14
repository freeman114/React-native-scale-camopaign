import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage'
import { LocationKey } from '../../../storageKeys';
import { LocationSelect } from './LocationSelect';

export const LocationSettingsScreen: React.FC = () => {
  const [ location, setLocation ] = useState({ title: '', level_id: null, id: null });

  const onLocationChange = ({ level_id, title, id }) => {
    const selected = {
      level_id,
      title,
      id
    };
    setLocation(selected);
    AsyncStorage.setItem(LocationKey, JSON.stringify(selected));
  };


  useEffect(() => {
    AsyncStorage.getItem(LocationKey).then((location) => {
      if (location) {
        setLocation(JSON.parse(location))
      }
    })
  }, []);

  return (
    <SafeAreaView style={styles.flex1}>
      <ScrollView
        style={styles.flex1}
        contentContainerStyle={styles.scrollContainer}
      >
        <View>
          {location.title ? <Text style={styles.text}>
            Selected location - {location.title}
          </Text> : <Text style={styles.text}>Select location</Text>}
          <LocationSelect
            onLocationSelect={onLocationChange}
            selectedId={location.id}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex1: { flex: 1 },
  scrollContainer: { paddingVertical: 16, paddingHorizontal: 16 },
  text: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
});
