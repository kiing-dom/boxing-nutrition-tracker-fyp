import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  doc,
  collectionGroup,
} from "firebase/firestore";
import { TextInput, ProgressBar, Modal} from "react-native-paper";
import { db } from "../../firebaseConfig";
import { Card, Divider, Button, ButtonGroup, Icon } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { loadAsync } from "expo-font";
import RemainingCaloriesContext from "../../contexts/RemainingCaloriesContext";
import RemainingCarbsContext from "../../contexts/RemainingCarbsContext";
import RemainingProteinContext from "../../contexts/RemainingProteinContext";
import RemainingFatsContext from "../../contexts/RemainingFatsContext";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { LineChart } from "react-native-gifted-charts";
import { startOfDay, isEqual, isSameDay } from "date-fns";
import { Calendar } from "react-native-calendars";

const Dashboard = () => {
  const [mealData, setMealData] = useState([[]]);
  const [loading, setLoading] = useState(true);
  const [tdee, setTdee] = useState(null);
  const [originalTdee, setOriginalTdee] = useState(null);
  const [weight, setWeight] = useState(0);
  const [weightData, setWeightData] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [lineData, setLineData] = useState([]);
  const [totalCaloriesConsumed, setTotalCaloriesConsumed] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [phaseIndex, setPhaseIndex] = useState(1);

  const [selectedDate, setSelectedDate] = useState(null);
  const [mealDataForDate, setMealDataForDate] = useState([]);
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const [isMealModalVisible, setIsMealModalVisible] = useState(false);

  const prevMealDataRef = useRef();

  const { remainingCalories, setRemainingCalories } = useContext(
    RemainingCaloriesContext
  );
  const { remainingCarbs, setRemainingCarbs } = useContext(
    RemainingCarbsContext
  );
  const { remainingProtein, setRemainingProtein } = useContext(
    RemainingProteinContext
  );
  const { remainingFat, setRemainingFat } = useContext(RemainingFatsContext);

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
            setOriginalTdee(userData.tdee);
            setWeight(userData.currentWeight); // Set the initial weight from Firebase
            // Fetch weight data
            const weightHistory = userData.weightHistory || [];
            // Process all weight history data for line chart
            const processedLineData = weightHistory
              .filter((entry) => entry.timestamp && entry.weight) // Filter out entries with missing timestamp or weight
              .map((entry) => ({
                value: entry.weight,
                label: entry,
              }));
            setWeightData(weightHistory);
            setLineData(processedLineData); // Set lineData here

            // Fetch meal data
            fetchMealData(querySnapshot.docs[0].id);
          } else {
            // Handle case where user data not found
          }
          setLoading(false);
        } else {
          // No user token found, navigate to login
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error
      }
    };

    const fetchMealData = async (userDocId) => {
      try {
        const foodsQuery = query(
          collectionGroup(db, "foods"),
          where("__name__", ">=", `users/${userDocId}/`)
        );

        const foodsSnapshot = await getDocs(foodsQuery);
        const currentDate = new Date();
        const mealData = Array.from({ length: 3 }, () => []);

        foodsSnapshot.docs.forEach((foodDoc) => {
          const foodData = foodDoc.data();
          const mealIndex = foodData.mealIndex;

          if (isSameDay(foodData.timestamp.toDate(), currentDate)) {
            // Filter based on timestamp
            mealData[mealIndex] = [
              ...mealData[mealIndex],
              { id: foodDoc.id, ...foodData },
            ];
          }
        });

        setMealData(mealData);
      } catch (error) {
        console.error("Error fetching meal data:", error);
        // Handle error
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    let totalCaloriesConsumed = 0;
    mealData.forEach((meal) => {
      meal.forEach((food) => {
        totalCaloriesConsumed += Math.floor(parseFloat(food.calories));
      });
    });

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

    // Update prevMealDataRef with current mealData
    prevMealDataRef.current = mealData;
  }, [mealData, tdee]);

  useEffect(() => {
    // Process weightHistory data for line chart
    const processedLineData = weightData
      .filter((entry) => entry.timestamp && entry.weight) // Filter out entries with missing timestamp or weight
      .map((entry) => {
        if (entry.timestamp instanceof Date) {
          return {
            value: entry.weight,
            label: `${entry.timestamp.getDate()}/${
              entry.timestamp.getMonth() + 1
            }`,
          };
        } else if (entry.timestamp.toDate instanceof Function) {
          // Check if toDate() method is available
          return {
            value: entry.weight,
            label: `${entry.timestamp.toDate().getDate()}/${
              entry.timestamp.toDate().getMonth() + 1
            }`,
          };
        } else {
          console.error("Invalid timestamp format:", entry.timestamp);
          return null; // or handle the case appropriately
        }
      })
      .filter((entry) => entry !== null); // Filter out entries with invalid timestamp format

    setLineData(processedLineData);
  }, [weightData]);

  useEffect(() => {
    // Only update totalCaloriesConsumed if mealData has changed
    if (mealData !== prevMealDataRef.current) {
      let totalCalories = 0;
      mealData.forEach((meal) => {
        meal.forEach((food) => {
          totalCalories += Math.floor(parseFloat(food.calories));
        });
      });
      setTotalCaloriesConsumed(totalCalories);
    }
  }, [mealData]);

  const handlePhaseChange = (index) => {
    switch (index) {
      case 0:
        // Rest phase - decrease TDEE by 500 from the original TDEE
        setTdee((prevTdee) => originalTdee - 500);
        break;
      case 1:
        // Default phase - set TDEE back to the original value
        setTdee(originalTdee);
        break;
      case 2:
        // Training phase - increase TDEE by 500 from the original TDEE
        setTdee((prevTdee) => originalTdee + 500);
        break;
      default:
        break;
    }
    setPhaseIndex(index);
  };

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

          // Update current weight
          await updateDoc(doc(db, "users", userId), {
            currentWeight: parseFloat(newWeight),
          });

          // Check if there's an existing entry for today
          const existingEntryIndex = userData.weightHistory.findIndex(
            (entry) => {
              const entryDate = startOfDay(entry.timestamp.toDate()); // Convert Firestore timestamp to Date object
              const entryYear = entryDate.getFullYear();
              const entryMonth = entryDate.getMonth();
              const entryDay = entryDate.getDate();
              const todayYear = today.getFullYear();
              const todayMonth = today.getMonth();
              const todayDay = today.getDate();
              return (
                entryYear === todayYear &&
                entryMonth === todayMonth &&
                entryDay === todayDay
              );
            }
          );

          if (existingEntryIndex !== -1) {
            console.log("Updating existing entry for today.");
            // Update existing entry with new timestamp and weight
            userData.weightHistory[existingEntryIndex].weight =
              parseFloat(newWeight);
            userData.weightHistory[existingEntryIndex].timestamp = timestamp;
          } else {
            console.log("Adding new entry for today.");
            // Add new entry for today
            const newWeightHistoryEntry = {
              weight: parseFloat(newWeight),
              timestamp,
            };
            // Push new entry to weightHistory array
            userData.weightHistory.push(newWeightHistoryEntry);
          }

          // Update weightHistory in the database
          await updateDoc(doc(db, "users", userId), {
            weightHistory: userData.weightHistory,
          });
          // Update local weight data
          setWeightData(userData.weightHistory);
          setIsModalVisible(false);
        }
      }
    } catch (error) {
      console.error("Error updating weight:", error);
      // Handle error
    }
  };

  const handleDateSelect = (date) => {
    setIsMealModalVisible(true);
    setSelectedDate(date.dateString);
    fetchMealDataForDate(date.dateString);
  };


const fetchMealDataForDate = async (date) => {
  try {
    const selectedDate = new Date(date);

    const startOfDayTimestamp = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    const foodsQuery = query(
      collectionGroup(db, "foods"),
      where("timestamp", ">=", startOfDayTimestamp), // Filter for timestamps on or after the start of the selected date
      where("timestamp", "<", new Date(startOfDayTimestamp.getTime() + 24 * 60 * 60 * 1000)) // Filter for timestamps before the next day
    );

    // Execute the query
    const querySnapshot = await getDocs(foodsQuery);

    // Process the query snapshot to get the meal data
    const mealsForDate = Array.from({ length: 3 }, () => []); // Initialize meal data array

    querySnapshot.forEach((foodDoc) => {
      const foodData = foodDoc.data();
      const mealIndex = foodData.mealIndex; // Get mealIndex from food document
      mealsForDate[mealIndex] = [
        ...mealsForDate[mealIndex],
        { id: foodDoc.id, ...foodData },
      ];
    });

    // Set the meal data for the selected date
    setMealDataForDate(mealsForDate);
    console.log(mealDataForDate)
  } catch (error) {
    console.error("Error fetching meal data:", error);
    // Handle error
  }
};


  const renderContent = () => {
    if (loading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      // Calculate the progress (remaining calories percentage)
      const remainingPercentage = (1 - remainingCalories / tdee) * 100;
      const remainingCarbsPercentage = 1 - remainingCarbs / ((tdee * 0.6) / 4);
      const remainingProteinPercentage =
        1 - remainingProtein / ((tdee * 0.15) / 4);
      const remainingFatPercentage = 1 - remainingFat / ((tdee * 0.25) / 9);

      return (
        <View style={styles.container}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.heading, marginTop: 12 }}>Today</Text>
            <Button
              containerStyle={{ marginTop: 10 }}
              type="clear"
              icon={<Icon name="calendar-month" type="material-community" />}
              onPress={() => setIsCalendarModalVisible(true)}
            />
          </View>
          {/* Modal for displaying meal information */}
          {/* Modal for displaying calendar */}

          {/* Display Calories */}
          <Card containerStyle={styles.container1}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.cardTitle}>Calories</Text>
              {/** Display Toggle Buttons for Selecting Phases*/}
              <ButtonGroup
                buttons={["Rest", "Default", "Training"]}
                containerStyle={{
                  justifyContent: "flex-start",
                  width: "50%",
                  marginTop: -8,
                  marginLeft: 72,
                }}
                onPress={handlePhaseChange}
                selectedIndex={phaseIndex}
                textStyle={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: 12,
                  color: "#000",
                }}
                selectedButtonStyle={{ backgroundColor: "#0022ff" }}
              />
            </View>
            <View style={[styles.cardContent, { flexDirection: "row" }]}>
              <AnimatedCircularProgress
                rotation={0}
                size={100}
                width={8}
                fill={remainingPercentage}
                tintColor="#002FF5"
                backgroundColor="#d3d3d3"
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
              <View style={{ marginLeft: 20 }}>
                <View style={{ flexDirection: "row", marginLeft: -8 }}>
                  <Icon
                    name="bread-slice"
                    type="material-community"
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.cardSubTitle}>
                    Carbs ({Math.floor(remainingCarbs)}g left){"\n"}
                    <ProgressBar
                      color="#0022ff"
                      progress={remainingCarbsPercentage}
                      style={{ width: 200, marginTop: 4 }}
                    />
                  </Text>
                </View>

                <View style={{ flexDirection: "row", marginLeft: -8 }}>
                  <Icon
                    name="food-drumstick"
                    type="material-community"
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.cardSubTitle}>
                    Protein ({Math.floor(remainingProtein)}g left){"\n"}
                    <ProgressBar
                      color="#0022ff"
                      progress={remainingProteinPercentage}
                      style={{ width: 200, marginTop: 4 }}
                    />
                  </Text>
                </View>

                <View style={{ flexDirection: "row", marginLeft: -8 }}>
                  <Icon
                    name="cupcake"
                    type="material-community"
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.cardSubTitle}>
                    Fat ({Math.floor(remainingFat)}g left){"\n"}
                    <ProgressBar
                      color="#0022ff"
                      progress={remainingFatPercentage}
                      style={{ width: 200, marginTop: 4 }}
                    />
                  </Text>
                </View>
              </View>
            </View>
          </Card>
          <Divider />
          {/* Weight Card */}
          <TouchableOpacity
            style={styles.container1}
            onPress={() => setIsModalVisible(true)}
          >
            <Card containerStyle={styles.container1}>
              <Text style={styles.cardTitle}>Weight</Text>
              <View style={styles.cardContent}>
                <Text style={{ fontFamily: "Montserrat-Regular" }}>
                  Current Weight: {weight} kg
                </Text>
              </View>
              <LineChart
                data={lineData}
                spacing={65}
                showXAxisIndices
                yAxisLabelSuffix="kg"
                showValuesAsDataPointsText
                xAxisLength={300}
                rulesLength={300}
                hideYAxisText
              />
            </Card>
          </TouchableOpacity>
          {/** Modal For Weight Update*/}
          <Modal
            visible={isModalVisible}
            onDismiss={() => setIsModalVisible(false)}
            contentContainerStyle={styles.modalContent}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Update Weight</Text>
              <TextInput
                label="New Weight"
                keyboardType="numeric"
                onChangeText={(text) => setNewWeight(text)}
                style={styles.input}
              />
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={() => handleWeightChange(newWeight)}
                >
                  Update
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => setIsModalVisible(false)}
                >
                  Cancel
                </Button>
              </View>
            </View>
          </Modal>

          {/** Modal For Calendar */}
          <Modal
            visible={isCalendarModalVisible}
            animationType="slide"
            onDismiss={() => setIsCalendarModalVisible(false)}
            contentContainerStyle={styles.modalContent}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <Calendar onDayPress={handleDateSelect} />
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={() => setIsCalendarModalVisible(false)}
                >
                  Close
                </Button>
              </View>
            </View>
          </Modal>


          <Modal
  visible={isMealModalVisible}
  animationType="slide"
  onDismiss={() => setIsMealModalVisible(false)}
  contentContainerStyle={styles.modalContent}
>
  <View style={styles.modalView}>
    <Text style={styles.modalTitle}>Meal Data for Selected Date:</Text>
    {mealDataForDate.map((meal, index) => (
      <View key={index}>
        <Text style={{ fontFamily: "Montserrat-SemiBold", fontSize: 16 }} >Meal {index + 1}:</Text>
        {meal.map((food) => (
          <View key={food.id}>
            <Text style={{fontFamily: "Montserrat-SemiBold", fontSize: 12 }}  >{food.name}</Text>
            <Text style={{fontFamily: "Montserrat-Regular", fontSize: 12 }}>Carbs: {food.carbohydrates}g</Text>
            <Text style={{fontFamily: "Montserrat-Regular", fontSize: 12 }}>Protein: {food.protein}g</Text>
            <Text style={{fontFamily: "Montserrat-Regular", fontSize: 12 }}>Fats: {food.fats}g</Text>
            <Text style={{fontFamily: "Montserrat-Regular", fontSize: 12 }}>Calories: {food.calories} kcal </Text>
          </View>
        ))}
        <Divider style={{marginBottom: 24, width: 200}} />
      </View>
    ))}
    <Button onPress={() => setIsMealModalVisible(false)}>Close</Button>
  </View>
</Modal>


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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  container1: {
    marginBottom: 20,
    borderRadius: 10,
    width: "100%",
    alignSelf: "center",
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
  input: {
    marginBottom: 10,
    width: "100%",
  },
  modalContainer: {
    width: "80%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 20,
    margin: 20,
    borderRadius: 10,
    elevation: 4,
    backgroundColor: "white"
  },
  modalView: {
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  progressText: {
    fontSize: 32,
    fontFamily: "Montserrat-SemiBold",
    textAlign: "center",
  },
});

export default Dashboard;
