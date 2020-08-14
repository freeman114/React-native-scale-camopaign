import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthTabStack } from "./AuthNavigator";

const Stack = createStackNavigator();

export default function() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={"Root"} component={AuthTabStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
