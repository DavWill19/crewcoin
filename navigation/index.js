// If you are not familiar with React Navigation, check out the "Fundamentals" guide:
// https://reactnavigation.org/docs/getting-started
import {
  DarkTheme,
  LightTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HistoryScreen from "../screens/HistoryScreen";
import SendScreen from "../screens/SendScreen";
import Login from "../screens/LoginScreen";
import Signup from "../screens/SignupScreen";
import SettingsScreen from "../screens/SettingsScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import LinkingConfiguration from "./LinkingConfiguration";
import { UserContext } from "../screens/UserContext";
import React, { useState, useContext } from "react";

export default function Navigation({ colorScheme }) {
  const [value, setValue] = useState({});
  return (
    <UserContext.Provider value={{ value, setValue }}>
      <NavigationContainer
        linking={LinkingConfiguration}
        theme={colorScheme === "dark" ? LightTheme : DefaultTheme}
      >
        <RootNavigator />

      </NavigationContainer>
    </UserContext.Provider>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator();

function RootNavigator(props) {
const { value, setValue } = useContext(UserContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Login"
        component={Login}

      />
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}

      />
      <Stack.Screen

        name="History"
        component={HistoryScreen}
      />
      <Stack.Screen

        name="Send"
        component={SendScreen}
      />
      <Stack.Screen

        name="Settings"
        component={SettingsScreen}
      />
      <Stack.Screen

        name="Signup"
        component={Signup}
      />
      <Stack.Screen

        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />

    </Stack.Navigator>
  );
}
