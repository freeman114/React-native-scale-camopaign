import React, { Component } from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation, useRoute} from "@react-navigation/native";
import NavigationNames from "../../navigations/NavigationNames";

const GREEN = 'rgba(141,196,63,1)';
const PURPLE = 'rgba(108,48,237,1)';

export const SurveyCompletedScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const answers = route.params['surveyAnswers'];

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.questionText}>Thanks! We have received your answers!</Text>
          <Button
            color={GREEN}
            onPress={() => navigation.navigate(NavigationNames.VisitorsProjectsScreen)}
            disabled={false}
            backgroundColor={GREEN}
            title={'Finish'}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  container: {
    minWidth: '70%',
    maxWidth: '100%',
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'white',
    elevation: 20,
    borderRadius: 10,
    maxHeight: '100%',
    padding: 60,
    textAlign: 'center'
  },
  questionText: {
    marginBottom: 20,
    fontSize: 20,
    color: 'blue'
  },
});