import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Button, ActivityIndicator } from "react-native";
import { getDocs, collection, query, where, updateDoc, doc, arrayUnion, arrayRemove } from "firebase/firestore";
import { TextInput, ProgressBar } from "react-native-paper"
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
import { LineChart } from "react-native-gifted-charts";
import { startOfDay, isEqual } from "date-fns";

const Dashboard = () => {
  const [mealData, setMealData] = useState([[]]);
  const [loading, setLoading] = useState(true);
  const [tdee, setTdee] = useState(null);
  const [weight, setWeight] = useState(0);
  const [weightData, setWeightData] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [lineData, setLineData] = useState([]);
  const [totalCaloriesConsumed, setTotalCaloriesConsumed] = useState(0)

  const { remainingCalories, setRemainingCalories } = useContext(RemainingCaloriesContext);
  const { remainingCarbs, setRemainingCarbs } = useContext(RemainingCarbsContext);
  const { remainingProtein, setRemainingProtein } = useContext(RemainingProteinContext);
  const { remainingFat, setRemainingFat } = useContext(RemainingFatsContext)

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
          const parsedToken = JSON.parse(userToken);
          const userRef = collection(db, "users");
          const querySnapshot = await getDocs(
            query(userRef, where("uid", "==", parsedToken.uid))
          );
    
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setTdee(userData.tdee);
            setWeight(userData.currentWeight); // Set the initial weight from Firebase
            // Fetch weight data
            const weightHistory = userData.weightHistory || [];
            // Remove seconds from timestamp
            const cleanWeightHistory = weightHistory.map(entry => {
              const { seconds, ...rest } = entry.timestamp; // Destructure seconds property
              return { ...rest }; // Return new timestamp object without seconds
            });
            setWeightData(cleanWeightHistory);
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

  useEffect(() => {
    // Calculate total protein, carbohydrates, and fats consumed
    const totalProteinConsumed = mealData.reduce((total, meal) => {
      return (
        total +
        meal.reduce((mealTotal, food) => {
          return mealTotal + parseFloat(food.protein);
        }, 0)
      );
    }, 0);

    const totalCarbsConsumed = mealData.reduce((total, meal) => {
      return (
        total +
        meal.reduce((mealTotal, food) => {
          return mealTotal + parseFloat(food.carbohydrates);
        }, 0)
      );
    }, 0);

    const totalFatsConsumed = mealData.reduce((total, meal) => {
      return (
        total +
        meal.reduce((mealTotal, food) => {
          return mealTotal + parseFloat(food.fats);
        }, 0)
      );
    }, 0);

    setRemainingProtein(Math.floor((tdee * 0.15) / 4) - totalProteinConsumed);
    setRemainingCarbs(Math.floor((tdee * 0.6) / 4) - totalCarbsConsumed);
    setRemainingFat(Math.floor((tdee * 0.25) / 9) - totalFatsConsumed);
    setRemainingCalories(Math.floor(tdee - totalCaloriesConsumed));
  }, [mealData, tdee]);

  useEffect(() => {
    // Process weightHistory data for line chart
    const processedLineData = weightData
      .filter(entry => entry.timestamp && entry.weight) // Filter out entries with missing timestamp or weight
      .map(entry => ({
        value: entry.weight
      }));

    setLineData(processedLineData);
  }, [weightData]);

  useEffect(() => {
    let totalCalories = 0;
    mealData.forEach((meal) => {
      meal.forEach((food) => {
        totalCalories += Math.floor(parseFloat(food.calories));
      });
    });
    setTotalCaloriesConsumed(totalCalories);
  }, [mealData]);


  const handleWeightChange = async (newWeight) => {
    setWeight(newWeight);
    const timestamp = new Date(); // Create a timestamp on the client side
    const today = startOfDay(new Date()); // Get start of today
  
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        const userRef = collection(db, "users");
        const querySnapshot = await getDocs(
          query(userRef, where("uid", "==", JSON.parse(userToken).uid))
        );
  
        if (!querySnapshot.empty) {
          const userId = querySnapshot.docs[0].id;
          const userData = querySnapshot.docs[0].data();
          console.log("userData:", userData); // Debugging line
  
          // Update current weight
          await updateDoc(doc(db, "users", userId), {
            currentWeight: parseFloat(newWeight)
          });
  
          // Check if there's an existing entry for today
          const existingEntryIndex = userData.weightHistory.findIndex(entry => {
            const entryDate = startOfDay(entry.timestamp.toDate()); // Convert Firestore timestamp to Date object
            const entryYear = entryDate.getFullYear();
            const entryMonth = entryDate.getMonth();
            const entryDay = entryDate.getDate();
            const todayYear = today.getFullYear();
            const todayMonth = today.getMonth();
            const todayDay = today.getDate();
            return entryYear === todayYear && entryMonth === todayMonth && entryDay === todayDay;
          });
  
          if (existingEntryIndex !== -1) {
            console.log("Updating existing entry for today.");
            // Update existing entry with new timestamp and weight
            userData.weightHistory[existingEntryIndex].weight = parseFloat(newWeight);
            userData.weightHistory[existingEntryIndex].timestamp = timestamp;
          } else {
            console.log("Adding new entry for today.");
            // Add new entry for today
            const newWeightHistoryEntry = { weight: parseFloat(newWeight), timestamp };
            // Push new entry to weightHistory array
            userData.weightHistory.push(newWeightHistoryEntry);
          }
  
          // Update weightHistory in the database
          await updateDoc(doc(db, "users", userId), {
            weightHistory: userData.weightHistory
          });
          // Update local weight data
          setWeightData(userData.weightHistory);
        }
      }
    } catch (error) {
      console.error("Error updating weight:", error);
      // Handle error
    }
  };

  

  
  
  const renderContent = () => {
    if (loading) {
      return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      </View>
      );
      
    } else {
      // Calculate the progress (remaining calories percentage)
      const remainingPercentage = (1 - remainingCalories / tdee) * 100;
      const remainingCarbsPercentage = (1 - remainingCarbs / (tdee * 0.6 / 4));
      const remainingProteinPercentage = (1 - remainingProtein / (tdee * 0.15 / 4));
      const remainingFatPercentage = (1 - remainingFat / (tdee * 0.25 / 9));

      // Process weightHistory data for line chart
      


      return (
        <View style={styles.container}>
          <Text style={styles.heading}>Today</Text>
          {/* Display Calories */}
          <Card containerStyle={styles.container1}>
            <Text style={styles.cardTitle}>Calories</Text>
            <View style={[styles.cardContent, {flexDirection: "row" }]}>
              <AnimatedCircularProgress
                rotation={0}
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
          {/* Weight Card */}
          <Card containerStyle={styles.container1}>
            <Text style={styles.cardTitle}>Weight</Text>
            <View style={styles.cardContent}>
              <Text>Current Weight: {weight} kg</Text>
              <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={text => handleWeightChange(text)}
                value={weight.toString()} // Convert to string for TextInput
                keyboardType="numeric"
              />
              <Button title="Update Weight" onPress={() => {}} />
            </View>
            <LineChart
              data={lineData}
              showXAxisIndices
            />
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