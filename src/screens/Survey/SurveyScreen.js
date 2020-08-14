import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, Button, Text, TextInput, View, ActivityIndicator} from 'react-native';
import {useNavigation, useRoute} from "@react-navigation/native";
import NavigationNames from "../../navigations/NavigationNames";
import { apiGetProjectSurveyRequest, apiSaveProjectAnswersRequest } from "../../api/visitors";
import { Survey } from './Survey';

const GREEN = 'rgba(141,196,63,1)';
const PURPLE = 'rgba(108,48,237,1)';

export const SurveyScreen = () => {
  const navigation = useNavigation();
  const surveyRef = useRef();
  const route = useRoute();

  const projectId = route.params['projectId'];
  const [ bgColor, setBgColor ] = useState('transparent');
  const [ survey, setSurvey ] = useState(null);
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (!survey) {
      apiGetProjectSurveyRequest(projectId, data => {
        setLoading(false);
        setSurvey(data.survey);
      });
    }
  });


  const onSurveyFinished = (questions, answers) => {
    const projectId = route.params['projectId'];
    apiSaveProjectAnswersRequest(projectId, questions, answers, (response) => {
      navigation.navigate(NavigationNames.SurveyCompletedScreen, { surveyAnswers: answers });
    })
  };

  const onAnswerSubmitted = (answer) => {
    // some staff here
  };

  if (!survey) {

    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large"/>
        </View>
      )
    }

    return null;
  }

  return (
    <>
      <View style={[styles.background, { backgroundColor: bgColor }]}>
        <View style={styles.container}>
          <Survey
            ref={surveyRef}
            survey={survey}
            containerStyle={styles.surveyContainer}
            selectionGroupContainerStyle={styles.selectionGroupContainer}
            navButtonContainerStyle={{ flexDirection: 'row', justifyContent: 'space-around' }}
            onSurveyFinished={(questions, answers) => onSurveyFinished(questions, answers)}
            onAnswerSubmitted={(answer) => onAnswerSubmitted(answer)}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: '70%',
    maxWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 20,
    flex: 1,
  },
  answersContainer: {
    width: '90%',
    maxHeight: '20%',
    marginTop: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
    backgroundColor: 'white',
    elevation: 20,
    borderRadius: 10,
  },
  surveyContainer: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'white',
    alignContent: 'center',
    padding: 5,
    flexGrow: 0,
  },
  selectionGroupContainer: {
    flexDirection: 'column',
    backgroundColor: 'white',
    alignContent: 'flex-end',
  },
  background: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
