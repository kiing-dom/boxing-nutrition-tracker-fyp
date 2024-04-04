import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Card, Divider } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { loadAsync } from "expo-font";
import RemainingCaloriesContext from "../../contexts/RemainingCaloriesContext";
import RemainingCarbsContext from "../../contexts/RemainingCarbsContext";
import RemainingProteinContext from "../../contexts/RemainingProteinContext";
import RemainingFatsContext from "../../contexts/RemainingFatsContext";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { ProgressBar } from 'react-native-paper'

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tdee, setTdee] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const { remainingCalories } = useContext(RemainingCaloriesContext);
  const { remainingCarbs } = useContext(RemainingCarbsContext);
  const { remainingProtein } = useContext(RemainingProteinContext);
  const { remainingFat } = useContext(RemainingFatsContext)

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
      const remainingCarbsPercentage = (1 - remainingCarbs / (tdee * 0.6 / 4));
      const remainingProteinPercentage = (1 - remainingProtein / (tdee * 0.15 / 4));
      const remainingFatPercentage = (1 - remainingFat / (tdee * 0.15 / 9));

      return (
        <View style={styles.container}>
          <Text style={styles.heading}>Today</Text>
          {/* Display Calories */}
          <Card containerStyle={styles.container1}>
            <Text style={styles.cardTitle}>Calories</Text>
            <View style={[styles.cardContent, {flexDirection: "row" }]}>
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
                    <Text style={styles.progressText}>
                      {Math.floor(remainingCalories)}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: 14,
                        textAlign: "center",
                      }}
                    >
                      kcal
                    </Text>
                  </View>
                )}
              </AnimatedCircularProgress>
          <View style={{ marginLeft: 20}}>
          <Text style={styles.cardSubTitle}>Carbs ({Math.floor(remainingCarbs)}g left){"\n"}
          <ProgressBar progress={remainingCarbsPercentage} style={{ width: 200 }}/>
          </Text>
          
          <Text style={styles.cardSubTitle}>Protein ({Math.floor(remainingProtein)}g left){"\n"} 
          <ProgressBar progress={remainingProteinPercentage} style={{ width: 200}} />
          </Text>
          
          <Text style={styles.cardSubTitle}>Fat ({Math.floor(remainingFat)}g left){"\n"} 
          <ProgressBar progress={remainingFatPercentage} style={{ width: 200}} />
          </Text>

          </View>
        

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
    alignSelf: "baseline",
  },
  container1: {
    marginBottom: 20,
    borderRadius: 10,
    width: "100%",
  },
  cardTitle: {
    fontSize: 24,
    fontFamily: "Montserrat-SemiBold",
    marginBottom: 10,
    textAlign: "left",
  },
  cardSubTitle: {
    fontSize: 12,
    fontFamily: "Montserrat-SemiBold",
    marginBottom: 10,
    textAlign: "left",
  },
  cardContent: {
    marginBottom: 10,
    alignItems: "left", 
  },
  progressText: {
    fontSize: 32, 
    fontFamily: "Montserrat-SemiBold", 
    textAlign: "center", 
  },
});

export default Dashboard;
