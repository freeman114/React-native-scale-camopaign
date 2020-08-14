import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Sketch  } from 'expo-pixi';
import { debounce } from 'debounce';
import { apiGetAllUserRequest, IUser } from '../../../api/user';
import { Button } from '../../../components/buttons';

interface AsyncSelectProps {
  onSelect(user: IUser): void;
}

export const AsyncSelect: React.FC<AsyncSelectProps> = ({ onSelect }) => {
  const [ results, setResults ] = useState([]);
  const [ loading, setLoading ] = useState(false);

  const fetchUsers = (text) => {
    if (text) {
      setLoading(true);
      apiGetAllUserRequest(
        text,
        (results) => {
          setLoading(false);
          setResults(results.users);
        },
        () => setLoading(false)
      );
    } else {
      setResults([]);
    }
  };

  const onChangeText = debounce(fetchUsers, 200);

  return (
    <View>
      <TextInput
        style={styles.textBox}
        onChangeText={onChangeText}
        numberOfLines={1}
        underlineColorAndroid={'white'}
        placeholder="Search user"
        placeholderTextColor={'rgba(184,184,184,1)'}
        multiline
        blurOnSubmit
        returnKeyType="done"
      />
      <View style={styles.resultsBox}>
        {loading ? (
          <View>
            <ActivityIndicator size="large"/>
          </View>
        ) : (results && results.length > 0) ? (
          <ScrollView style={{ marginBottom: 60 }}>
            {results.map((result) => (
              <View style={styles.resultItem}>
                <View style={{ maxWidth: '70%' }}>
                  <Text style={styles.name}>{result.first_name} {result.last_name}</Text>
                  <Text>{result.organization}</Text>
                  <Text>Roles: {result.roles}</Text>
                </View>
                <Button onPress={() => onSelect(result)} style={styles.button} title="Select"/>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View>
            <Text>No results</Text>
          </View>
        )}
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  textBox: {
    borderWidth: 1,
    borderColor: 'rgba(204,204,204,1)',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    marginLeft: 10,
    marginRight: 10
  },
  resultsBox: {
    padding: 10
  },
  resultItem: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  button: {
    padding: 0,
    width: 100,
    height: 40
  },
  name: {
    fontWeight: 'bold'
  }
});