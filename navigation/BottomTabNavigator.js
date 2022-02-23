// Learn more about createBottomTabNavigator:
// https://reactnavigation.org/docs/bottom-tab-navigator
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useColorScheme } from "react-native";
import { useContext } from "react";
import { UserContext }  from "../screens/UserContext";
import Colors from "../constants/Colors";
import TabOneScreen from "../screens/TabOneScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import TabThreeScreen from "../screens/TabThreeScreen";
import LoginScreen from "../screens/LoginScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { useFocusEffect } from "@react-navigation/core";

const BottomTab = createBottomTabNavigator();


export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const { value, setValue } = useContext(UserContext);
  console.log(value.newStoreItem, "newStoreItem");

  function alertNew(user) {
    if (user) {
      return (
        <TabBarIcon name="ios-ellipse" color="gold" size={12} style={{ top: 2, right: 25, position: "absolute" }} />
      );
    } else {
      return null
    }
  }

  return (
    <BottomTab.Navigator
      screenOptions={{ style: { elevation: 20 }, headerShown: false, tabBarActiveTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="My Wallet"
        screenOptions={{ headerShown: false }}
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="wallet-outline" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Announcements"
        screenOptions={{ headerShown: false }}
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <>
              {alertNew(value.newAnnouncement)}
              <TabBarIcon name="newspaper-outline" color={color} />
            </>
          ),
        }}
      />
      <BottomTab.Screen
        name="Store"
        screenOptions={{ headerShown: false }}
        component={TabThreeNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <>
              {alertNew(value.newStoreItem)}
              <TabBarIcon name="cart-outline" color={color} />
            </>
          ),
        }}
      />
      <BottomTab.Screen
        name="Account"
        screenOptions={{ headerShown: false }}
        component={SettingsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="settings-outline" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab


function TabOneNavigator(props) {
  const TabOneStack = createStackNavigator();
  return (
    <TabOneStack.Navigator screenOptions={{ headerShown: false }}>
      <TabOneStack.Screen
        {...props}
        name="Wallet"
        component={TabOneScreen}
        options={{ headerTitle: "Wallet" }}
      />
    </TabOneStack.Navigator>

  );
}



function TabTwoNavigator(props) {
  const TabTwoStack = createStackNavigator();
  return (
    <TabTwoStack.Navigator screenOptions={{ headerShown: false }}>
      <TabTwoStack.Screen
        name="Announcements1"
        component={TabTwoScreen}
        options={{ headerTitle: "Announcements" }}
      />
    </TabTwoStack.Navigator>
  );
}



function TabThreeNavigator(props) {
  const TabThreeStack = createStackNavigator();
  return (
    <TabThreeStack.Navigator screenOptions={{ headerShown: false }}>
      <TabThreeStack.Screen
        name="Store1"
        component={TabThreeScreen}
        options={{ headerTitle: "Store" }}
      />
    </TabThreeStack.Navigator>
  );
}


function SettingsNavigator(props) {
  const TabFourStack = createStackNavigator();
  return (
    <TabFourStack.Navigator screenOptions={{ headerShown: false }}>
      <TabFourStack.Screen
        name="Account"
        component={SettingsScreen}
        options={{ headerTitle: "Account" }}
      />
    </TabFourStack.Navigator>
  );
}
