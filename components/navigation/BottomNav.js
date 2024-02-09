import { View, Text } from "react-native";
import React from "react";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LogMealScreen from "../home-components/LogMeals";
import Dashboard from "../home-components/Dashboard";
import MealPlans from "../home-components/MealPlans";
import Profile from "../home-components/Profile";

const Tab = createMaterialBottomTabNavigator();

const BottomNav = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#f0edf6"
      inactiveColor="#919191"
      barStyle={{ backgroundColor: "#694fad" }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialCommunityIcons
                name="view-dashboard"
                color={"#FFFFFF"}
                size={24}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Log Meals"
        component={LogMealScreen}
        options={{
          tabBarLabel: "Log Meals",
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialCommunityIcons
                name="clipboard-text"
                color={"#FFFFFF"}
                size={24}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Meal Plans"
        component={MealPlans}
        options={{
          tabBarLabel: "Meal Plans",
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialCommunityIcons
                name="food-apple"
                color={"#FFFFFF"}
                size={24}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="My Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialCommunityIcons
                name="account"
                color={"#FFFFFF"}
                size={24}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNav;
