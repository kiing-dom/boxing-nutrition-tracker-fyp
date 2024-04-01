import React, { useState } from "react";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LogMealScreen from "../home-components/LogMeals";
import Dashboard from "../home-components/Dashboard";
import Suggestions from "../home-components/Suggestions";
import Profile from "../home-components/Profile";
import RemainingCaloriesContext from "../../contexts/RemainingCaloriesContext";
import RemainingCarbsContext from "../../contexts/RemainingCarbsContext";
import RemainingProteinContext from "../../contexts/RemainingProteinContext";
import RemainingFatsContext from "../../contexts/RemainingFatsContext";

const Tab = createMaterialBottomTabNavigator();

const BottomNav = () => {
  const [remainingCalories, setRemainingCalories] = useState(0);
  const [remainingProtein, setRemainingProtein] = useState(0);
  const [remainingCarbs, setRemainingCarbs] = useState(0);
  const [remainingFat, setRemainingFat] = useState(0);

  return (
    <RemainingCaloriesContext.Provider value={{ remainingCalories, setRemainingCalories }}>
    <RemainingCarbsContext.Provider value={{ remainingCarbs, setRemainingCarbs }}>
    <RemainingProteinContext.Provider value={{ remainingProtein, setRemainingProtein }}>
    <RemainingFatsContext.Provider value={{ remainingFat, setRemainingFat }}>
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
          component={Suggestions}
          options={{
            tabBarLabel: "Suggestions",
            tabBarIcon: ({ color, size }) => {
              return (
                <MaterialCommunityIcons
                  name="lightbulb"
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
      </RemainingFatsContext.Provider>
      </RemainingProteinContext.Provider>
      </RemainingCarbsContext.Provider>
    </RemainingCaloriesContext.Provider>
  );
};

export default BottomNav;