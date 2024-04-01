import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Card, Divider } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from 'expo-splash-screen'
import { loadAsync } from "expo-font";
import RemainingCaloriesContext from "../../contexts/RemainingCaloriesContext";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tdee, setTdee] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const { remainingCalories } = useContext(RemainingCaloriesContext);

  useEffect(() => {
    const preventHide = SplashScreen.preventAutoHideAsync();

    // Load fonts here
    const loadFonts = async () => {
      await loadAsync({
        'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
        'Montserrat-SemiBold': require('../../assets/fonts/Montserrat-SemiBold.ttf')
      });
      setFontsLoaded(true);
    };

    loadFonts().then(() => {
      SplashScreen.hideAsync();
    });

    return () => preventHide;
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userToken = await AsyncStorage.getItem("userToken");
        if (userToken) {
          setLoading(true);
          const userRef = collection(db, "users");
          const querySnapshot = await getDocs(
            query(userRef, where("uid", "==", JSON.parse(userToken).uid))
          );

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setTdee(userData.tdee);
          } else {
            // Handle case where user data not found
          }
          setLoading(false);
        } else {
          // No user token found, navigate to login
          navigation.navigate("Login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error
      }
    };

    fetchUserData();
  }, []);
  
  const renderContent = () => {
    if (loading) {
      return <Text>Loading dashboard data...</Text>;
    } else {
      // Calculate the progress (remaining calories percentage)
      const remainingPercentage = (1 - remainingCalories / tdee) * 100;

      return (
        <View style={styles.container}>
          <Text style={styles.heading}>Today</Text>
          {/* Display Calories */}
          <Card containerStyle={styles.container1}>
            <Text style={styles.cardTitle}>Calories</Text>
            <View style={styles.cardContent}>
              <AnimatedCircularProgress
                rotation={-90}
                size={100} // Adjust size as needed
                width={8} // Adjust line width as needed
                fill={remainingPercentage} // Set fill based on remaining percentage
                tintColor="#8868BD" // Customize tint color (optional)
                backgroundColor="#d3d3d3" // Customize background color (optional)
              >
                {/* Customize center content */}
                {() => (
    <View>
      <Text style={styles.progressText}>{Math.floor(remainingCalories)}</Text>
      <Text style={{ fontFamily: "Montserrat-Regular", fontSize: 14, textAlign:"center" }}>kcal</Text>
    </View>
  )}
              </AnimatedCircularProgress>
            </View>
          </Card>
          <Divider />
        </View>
      );
    }
  };

  return <>{renderContent()}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontFamily: "Montserrat-SemiBold",
    marginBottom: 20,
    alignSelf: "baseline"
  },
  container1: {
    marginBottom: 20,
    borderRadius: 10,
    width: "100%"
  },
  cardTitle: {
    fontSize: 24,
    fontFamily: "Montserrat-SemiBold",
    marginBottom: 10,
    textAlign: "left",
  },
  cardContent: {
    marginBottom: 10,
    alignItems: "left", // Center content horizontally within the card
  },
  progressText: {
    fontSize: 32, // Adjust font size for progress value as needed
    fontFamily: "Montserrat-SemiBold", // Consider using the same font for consistency
    textAlign: "center", // Center text within the circular progress component
  },
});

export default Dashboard;
