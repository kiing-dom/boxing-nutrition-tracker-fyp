import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { loadAsync } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Card } from "@rneui/themed";

const Dashboard = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const preventHide = SplashScreen.preventAutoHideAsync();

    // Load fonts here
    const loadFonts = async () => {
      await loadAsync({
        "Montserrat-Regular": require("../../assets/fonts/Montserrat-Regular.ttf"),
        "Montserrat-SemiBold": require("../../assets/fonts/Montserrat-SemiBold.ttf"),
      });
      setFontsLoaded(true);
    };

    loadFonts().then(() => {
      SplashScreen.hideAsync();
    });

    return () => preventHide;
  }, []);

  if (!fontsLoaded) {
    return null; // Return nothing while fonts are loading
  }

  return (
    <>
      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Card
           title="Calories"
            
          >
            <Text>3,298 remaining</Text>
          </Card>
        </View>
        <Text style={styles.customText}>Dashboard</Text>
      </View>
      <View>
        {/* Date component */}
        <Text>Today</Text>
        {/* Card container */}
      </View>
    </>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  customText: {
    fontFamily: "Montserrat-Regular",
  },
});
