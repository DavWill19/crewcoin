// Learn more about createBottomTabNavigator:
// https://reactnavigation.org/docs/bottom-tab-navigator
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useColorScheme } from "react-native";

import Colors from "../constants/Colors";
import TabOneScreen from "../screens/TabOneScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import TabThreeScreen from "../screens/TabThreeScreen";
import LoginScreen from "../screens/LoginScreen";

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Login"
      screenOptions={{ style: { elevation: 20 }, headerShown: false, tabBarActiveTintColor: Colors[colorScheme].tint }}
    >
    <BottomTab.Screen
        
        name="Login"
        screenOptions={{ headerShown: false }}
        component={LoginNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="cash-outline" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Balance"
        screenOptions={{ headerShown: false }}
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="cash-outline" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Announcements"
        screenOptions={{ headerShown: false }}
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="newspaper-outline" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Store"
        screenOptions={{ headerShown: false }}
        component={TabThreeNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="cart" color={color} />
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
const TabOneStack = createStackNavigator();

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator screenOptions={{ headerShown: false }}>
      <TabOneStack.Screen
        name="Balance"
        component={TabOneScreen}
        options={{

          headerShown: false,
          header: null,
        }}
      />
    </TabOneStack.Navigator>

  );
}

const TabTwoStack = createStackNavigator();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator screenOptions={{ headerShown: false }}>
      <TabTwoStack.Screen
        name="Announcements"
        component={TabTwoScreen}
        options={{ headerTitle: "Announcements" }}
      />
    </TabTwoStack.Navigator>
  );
}

const TabThreeStack = createStackNavigator();

function TabThreeNavigator() {
  return (
    <TabThreeStack.Navigator screenOptions={{ headerShown: false }}>
      <TabThreeStack.Screen
        name="Store"
        component={TabThreeScreen}
        options={{ headerTitle: "Store" }}
      />
    </TabThreeStack.Navigator>
  );
}
const TabFourStack = createStackNavigator(); 

function LoginNavigator() {
  return (
    <TabFourStack.Navigator screenOptions={{ headerShown: false }}>
      <TabFourStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerTitle: "Login" }}
      />
    </TabFourStack.Navigator>
  );
}