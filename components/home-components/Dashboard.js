import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Card, Divider } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from 'expo-splash-screen'
import { loadAsync } from "expo-font";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tdee, setTdee] = useState(null);

  const [fontsLoaded, setFontsLoaded] = useState(false);

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
      return (
        <View style={styles.container}>
          <Text style={styles.heading}>Today</Text>
          {/* Display TDEE */}
          <Card containerStyle={styles.container1}>
            <Text style={styles.cardTitle}>Calories</Text>
            <View style={styles.cardContent}>
              <Text 
              style={{fontFamily:"Montserrat-Regular", fontSize: 32}}>
              {tdee}
              </Text>
              <Text style={{fontFamily:"Montserrat-Regular", fontSize: 20}}>kcal</Text>
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
    alignSelf:"baseline"
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
  },
});

export default Dashboard;
