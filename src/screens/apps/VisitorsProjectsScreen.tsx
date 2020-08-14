import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NavigationNames from '../../navigations/NavigationNames';
import { apiGetProjectsRequest, IProject } from '../../api/visitors';
import { Ionicons } from '@expo/vector-icons';


export const VisitorProject = React.memo<{ project: IProject }>(({ project }) => {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, flexDirection: 'column', margin: 1, marginBottom: 10 }}>
      <TouchableOpacity onPress={() => navigation.navigate(NavigationNames.SurveyScreen, { projectId: project.id })}>
        <View style={styles.cell}>
          {project.avatar && !Array.isArray(project.avatar)
            ? <Image source={{ uri: project.avatar }} style={styles.image} />
            : <Ionicons name="ios-people" color="#73CEC1" size={60} />}
          <Text style={styles.nameText}>{ project.name }</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
});

export const VisitorsProjectsScreen: React.FC = props => {
  const [ projects, setProjects ] = useState<IProject[]>(null);
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    if (!projects) {
      setLoading(true);
      apiGetProjectsRequest(({ projects }) => {
        setProjects(projects);
        setLoading(false);
      });
    }
  }, []);

  if (loading) {
    return (
      <View style={styles.MainContainer}>
        <ActivityIndicator size="large"/>
      </View>
    )
  }

  const isEmpty = !(projects && projects.length > 0);

  return (
    <View style={[styles.MainContainer, isEmpty ? styles.ContainerEmpty : []]}>
      {!isEmpty ? <FlatList
        data={projects || []}
        renderItem={({ item }) => <VisitorProject project={item} />}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
      /> : <Text style={styles.text}>No projects</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    paddingTop: 30,
  },
  ContainerEmpty: {
    alignItems: 'center'
  },
  text: {
    paddingLeft: 20
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: 100,
  },
  nameText: {
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100
  }
});