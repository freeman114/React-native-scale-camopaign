import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Theme } from '../theme';
import NavigationNames from './NavigationNames';
import { useLocalization } from '../localization';
import { stackScreenOptions, tabScreenOptions } from './NavigationHelper';
import {
  HomeScreen,
  ProfileScreen,
  PrivacyScreen,
  TermsScreen,
  AccountScreen,
  SettingsScreen,
  MenuScreen,
  AboutScreen,
  WriteScreen,
  BlogScreen,
  CalendarScreen,
  MediaScreen,
  CampaignListScreen,
  CampaignDetailScreen,
  DepartmentListScreen,
  DepartmentDetailScreen,
  MediaDetailScreen,
  NewAppointmentScreen,
  DoctorListScreen,
  DoctorDetailScreen,
  AppsScreen,
  VisitorsProjectsScreen,
  SurveyScreen,
  SurveyCompletedScreen,
} from '../screens';
import { ToolbarBrandLogo } from '../components';
import { SignatureSettingsScreen } from '../screens/menu/SignatureSettingsScreen';
import { LocationSettingsScreen } from '../screens/menu/LocationSettingsScreen';
import { ChangeUserScreen } from '../screens/menu/ChangeUserScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabStack = () => {
  const { getString } = useLocalization();
  return (
    <Stack.Navigator headerMode="screen" screenOptions={stackScreenOptions}>
      <Stack.Screen
        name={NavigationNames.HomeScreen}
        component={HomeScreen}
        options={{ headerTitle: () => <ToolbarBrandLogo /> }}
      />
      <Stack.Screen
        name={NavigationNames.CampaignListScreen}
        component={CampaignListScreen}
        options={{ title: getString('Campaigns') }}
      />
      <Stack.Screen
        name={NavigationNames.CampaignDetailScreen}
        component={CampaignDetailScreen}
      />
      <Stack.Screen
        name={NavigationNames.DepartmentListScreen}
        component={DepartmentListScreen}
        options={{ title: getString('Our Departments') }}
      />
      <Stack.Screen
        name={NavigationNames.DepartmentDetailScreen}
        component={DepartmentDetailScreen}
      />
      <Stack.Screen
        name={NavigationNames.NewAppointmentScreen}
        component={NewAppointmentScreen}
        options={{ title: getString('New Appointment') }}
      />
      <Stack.Screen
        name={NavigationNames.DoctorListScreen}
        component={DoctorListScreen}
        options={{ title: getString('Doctors') }}
      />
      <Stack.Screen
        name={NavigationNames.DoctorDetailScreen}
        component={DoctorDetailScreen}
      />
    </Stack.Navigator>
  );
};

const CalendarTabStack = () => {
  const { getString } = useLocalization();
  return (
    <Stack.Navigator headerMode="screen" screenOptions={stackScreenOptions}>
      <Stack.Screen
        name={NavigationNames.CalendarScreen}
        component={CalendarScreen}
        options={{ title: getString('Calendar') }}
      />
      <Stack.Screen
        name={NavigationNames.NewAppointmentScreen}
        component={NewAppointmentScreen}
        options={{ title: getString('New Appointment') }}
      />
      <Stack.Screen
        name={NavigationNames.DoctorDetailScreen}
        component={DoctorDetailScreen}
      />
    </Stack.Navigator>
  );
};

const MediaTabStack = () => {
  const { getString } = useLocalization();
  return (
    <Stack.Navigator headerMode="screen" screenOptions={stackScreenOptions}>
      <Stack.Screen
        name={NavigationNames.MediaScreen}
        component={MediaScreen}
        options={{ title: getString('Media') }}
      />
      <Stack.Screen
        name={NavigationNames.MediaDetailScreen}
        component={MediaDetailScreen}
        options={{ title: getString('Media') }}
      />
    </Stack.Navigator>
  );
};

const AppsTabStack = () => {
  const { getString } = useLocalization();
  return (
    <Stack.Navigator headerMode="screen" screenOptions={stackScreenOptions}>
      <Stack.Screen
        name={NavigationNames.AppsScreen}
        component={AppsScreen}
        options={{ title: getString('Apps') }}
      />
      <Stack.Screen
        name={NavigationNames.VisitorsProjectsScreen}
        component={VisitorsProjectsScreen}
        options={{ title: getString('Apps') }}
      />
    </Stack.Navigator>
  );
};

// const ProfileTabStack = () => {
//   return (
//     <Stack.Navigator headerMode="screen" screenOptions={stackScreenOptions}>
//       <Stack.Screen
//         name={NavigationNames.ProfileScreen}
//         component={ProfileScreen}
//         options={{ headerShown: false }}
//       />
//     </Stack.Navigator>
//   );
// };

const AccountTabStack = () => {
  const { getString } = useLocalization();
  return (
    <Stack.Navigator headerMode="screen" screenOptions={stackScreenOptions}>
      <Stack.Screen
        name={NavigationNames.AccountScreen}
        component={AccountScreen}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name={NavigationNames.PrivacyScreen}
        component={PrivacyScreen}
        options={{ title: getString('Privacy policy') }}
      />
      <Stack.Screen
        name={NavigationNames.TermsScreen}
        component={TermsScreen}
        options={{ title: getString('Terms of Service') }}
      />
      <Stack.Screen
        name={NavigationNames.ProfileScreen}
        component={ProfileScreen}
        options={{ title: getString('Profile') }}
      />
       <Stack.Screen
        name={NavigationNames.WriteScreen}
        component={WriteScreen}
        options={{ title: getString('Contact') }}
      />
     
    </Stack.Navigator>
  );
};

const MenuTabStack = () => {
  const { getString } = useLocalization();
  return (
    <Stack.Navigator headerMode="screen" screenOptions={stackScreenOptions}>
      <Stack.Screen
        name={NavigationNames.MenuScreen}
        component={MenuScreen}
        options={{ title: getString('Menu') }}
      />
       <Stack.Screen
        name={NavigationNames.BlogScreen}
        component={BlogScreen}
        options={{ title: getString('Blog') }}
      />
      <Stack.Screen
        name={NavigationNames.AboutScreen}
        component={AboutScreen}
        options={{ title: getString('About Us') }}
      />
    
      <Stack.Screen
        name={NavigationNames.WriteScreen}
        component={WriteScreen}
        options={{ title: getString('Write Us') }}
      />


      <Stack.Screen
        name={NavigationNames.SettingsScreen}
        component={SettingsScreen}
        options={{ headerShown: true, title: getString('Settings') }}
      />
      <Stack.Screen
        name={NavigationNames.SignatureSettingsScreen}
        component={SignatureSettingsScreen}
        options={{ headerShown: true, title: getString('Signature') }}
      />
      <Stack.Screen
        name={NavigationNames.LocationSettingsScreen}
        component={LocationSettingsScreen}
        options={{ headerShown: true, title: getString('Location') }}
      />
      <Stack.Screen
        name={NavigationNames.ChangeUserScreen}
        component={ChangeUserScreen}
        options={{headerShown: true, title: getString('Change User')}}
      />
    </Stack.Navigator>
  );
};

const HomePageTabNavigator = () => {
  return (
    <>
      <Tab.Navigator
        screenOptions={tabScreenOptions}
        tabBarOptions={{
          activeTintColor: Theme.colors.primaryColor,
          inactiveTintColor: Theme.colors.gray
        }}
      >
        <Tab.Screen name={NavigationNames.HomeTab} component={HomeTabStack} />
        <Tab.Screen
          name={NavigationNames.CalendarTab}
          component={CalendarTabStack}
        />
        <Tab.Screen name={NavigationNames.AppsTab} component={AppsTabStack} />
        <Tab.Screen name={NavigationNames.AccountTab} component={AccountTabStack} />
        <Tab.Screen name={NavigationNames.MenuTab} component={MenuTabStack} />
      </Tab.Navigator>
    </>
  )
};


export default HomePageTabNavigator;
