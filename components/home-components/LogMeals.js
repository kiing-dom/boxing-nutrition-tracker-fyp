import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import {
  getDocs,
  collection,
  collectionGroup,
  query,
  where,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { startOfDay, endOfDay, isSameDay } from 'date-fns';
import { db } from "../../firebaseConfig";
import { Card, Divider, Button, Icon } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { loadAsync } from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";
import { styles } from "../../styles/LogMealStyles";
import axios from "axios";
import RemainingCaloriesContext from "../../contexts/RemainingCaloriesContext";
import RemainingCarbsContext from "../../contexts/RemainingCarbsContext";
import RemainingProteinContext from "../../contexts/RemainingProteinContext";
import RemainingFatsContext from "../../contexts/RemainingFatsContext";
import { NUTRITIONIX_API_KEY, NUTRITIONIX_APP_ID, NUTRITIONIX_URL} from '@env'

const LogMealScreen = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [foodData, setFoodData] = useState({
    name: "",
    calories: "",
    protein: "",
    carbohydrates: "",
    fats: "",
  });
  const [mealData, setMealData] = useState(Array.from({ length: 3 }, () => []));
  const [totalCaloriesConsumed] = useState(0)
  const [mealCount, setMealCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [tdee, setTdee] = useState(null);
  const [selectedMealIndex, setSelectedMealIndex] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { remainingCalories, setRemainingCalories } = useContext(
    RemainingCaloriesContext
  );
  const { remainingProtein, setRemainingProtein } = useContext(
    RemainingProteinContext
  );
  const { remainingCarbs, setRemainingCarbs } = useContext(
    RemainingCarbsContext
  );
  const { remainingFat, setRemainingFat } = useContext(RemainingFatsContext);

  // Get the current date
const today = new Date();

// Calculate the start of the day (midnight) for today
const startOfToday = startOfDay(today);

// Calculate the end of the day (11:59:59 PM) for today
const endOfToday = endOfDay(today);

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
        console.log("Fetching user data...");
  
        const userToken = await AsyncStorage.getItem("userToken");
        if (userToken) {
          setLoading(true);
          console.log("User token found:", userToken);
  
          const userRef = collection(db, "users");
          console.log("User reference:", userRef);
  
          const querySnapshot = await getDocs(
            query(userRef, where("uid", "==", JSON.parse(userToken).uid))
          );
          console.log("Query snapshot:", querySnapshot);
  
          if (!querySnapshot.empty) {
            console.log("User data found.");
  
            const userData = querySnapshot.docs[0].data();
            console.log("User data:", userData);
            setTdee(userData.tdee);
  
            const userDocId = querySnapshot.docs[0].id;
  
            // Construct a query for the collection group "foods" where the document ID matches the user's document ID
            const foodsQuery = query(
              collectionGroup(db, "foods"),
              where("__name__", ">=", `users/${userDocId}/`)
            );
  
            console.log("Foods query:", foodsQuery);
  
            const foodsSnapshot = await getDocs(foodsQuery);
            console.log("Foods snapshot:", foodsSnapshot.docs);
  
            // Process the fetched foods data and filter based on timestamp
            const currentDate = new Date();
            const mealData = Array.from({ length: 3 }, () => []); // Initialize mealData array
  
            foodsSnapshot.docs.forEach(foodDoc => {
              const foodData = foodDoc.data();
              const mealIndex = foodData.mealIndex; // Get mealIndex from food document
  
              if (isSameDay(foodData.timestamp.toDate(), currentDate)) { // Filter based on timestamp
                mealData[mealIndex] = [...mealData[mealIndex], { id: foodDoc.id, ...foodData }];
              }
            });
  
            // Update state or perform other actions with mealData
            console.log("Meal data:", mealData);
  
            // Set mealData state
            setMealData(mealData);
          } else {
            // Handle case where user data not found
            console.log("User data not found.");
          }
          setLoading(false);
        } else {
          // No user token found, navigate to login
          console.log("No user token found. Navigating to login...");
          navigation.navigate("Login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error
      }
    };
  
    fetchUserData();
  }, []);
  

  
  // Calculate remaining calories
  // Update the remainingCalories state in the context
  useEffect(() => {
    const calculateRemainingNutrients = () => {
        if (mealData) {
            // Calculate total calories consumed
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
        }
    };

    calculateRemainingNutrients();
}, [mealData, tdee]);
  // Function to handle search button click
  const handleSearch = async () => {
    // Call the searchFood function with the search query
    await searchFood(searchQuery);
  };

  const searchFood = async (query) => {
    const appId = NUTRITIONIX_APP_ID;
    const appKey = NUTRITIONIX_API_KEY;
    const url = NUTRITIONIX_URL;

    try {
      const response = await axios.post(
        url,
        {
          query,
        },
        {
          headers: {
            "x-app-id": appId,
            "x-app-key": appKey,
          },
        }
      );

      // Process the response data to extract the nutrient details
      const foodData = response.data.foods.map((food) => ({
        name: food.food_name,
        calories: food.nf_calories,
        protein: food.nf_protein,
        carbohydrates: food.nf_total_carbohydrate,
        fats: food.nf_total_fat,
        // Add other nutrient fields as needed
      }));

      setSearchResults(foodData);
    } catch (error) {
      console.error("Error searching for food:", error);
      setSearchResults([]); // Return empty array in case of error
    }
  };

  const handleAddFood = async () => {
    // Check if a meal card is selected
    if (selectedMealIndex !== null) {
      // Extract all nutrition data from foodData
      const { name, calories, protein, carbohydrates, fats } = foodData;
  
      try {
        const userToken = await AsyncStorage.getItem("userToken");
        if (userToken) {
          const userRef = collection(db, "users");
          const querySnapshot = await getDocs(
            query(userRef, where("uid", "==", JSON.parse(userToken).uid))
          );
  
          if (!querySnapshot.empty) {
            const userDocRef = querySnapshot.docs[0].ref;
  
            // Create a subcollection within the user's document for meals
            const mealCollectionRef = collection(userDocRef, "meals", (selectedMealIndex).toString(), "foods");
  
            // Add the new food to the selected meal's subcollection
            const foodDocRef = await addDoc(mealCollectionRef, {
              name,
              calories,
              protein,
              carbohydrates,
              fats,
              timestamp: serverTimestamp(), // Add timestamp
              mealIndex: selectedMealIndex
            });
  
            // Update the state with the modified mealData
            const newMealData = [...mealData];
            newMealData[selectedMealIndex] = newMealData[selectedMealIndex] || []; // Ensure array exists
            newMealData[selectedMealIndex].push({ id: foodDocRef.id, name, calories, protein, carbohydrates, fats }); // Store food ID for potential future reference
            setMealData(newMealData);
  
            // Reset the foodData state
            setFoodData({
              name: "",
              calories: "",
              protein: "",
              carbohydrates: "",
              fats: "",
            });
  
            // Close the modal
            setModalVisible(false);
            // Reset the selected meal index
            setSelectedMealIndex(null);
          } else {
            // Handle case where user data not found
          }
        } else {
          // No user token found, navigate to login
          navigation.navigate("Login");
        }
      } catch (error) {
        console.error("Error adding food:", error);
        // Handle error
      }
    } else {
      // Handle case where no meal card is selected
      Alert.alert("Error", "Please select a meal to add food to.");
    }
  };
  
  const handleAddFoodFromSearch = (food) => {
    setFoodData({
      name: food.name,
      calories: food.calories.toString(),
      protein: food.protein.toString(),
      carbohydrates: food.carbohydrates.toString(),
      fats: food.fats.toString(),
    });
    setModalVisible(true);
  };

  // Function to handle clicking on the "Add Food" button of a meal card
  const handleAddFoodButtonClicked = (mealIndex) => {
    setSelectedMealIndex(mealIndex);
    setModalVisible(true);
  };

  const handleRemoveFood = async (mealIndex, foodIndex) => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        const userRef = collection(db, "users");
        const querySnapshot = await getDocs(
          query(userRef, where("uid", "==", JSON.parse(userToken).uid))
        );
  
        if (!querySnapshot.empty) {
          const userDocRef = querySnapshot.docs[0].ref;
  
          // Reference the subcollection corresponding to the selected meal index
          const mealIndexCollectionRef = collection(userDocRef, "meals", (mealIndex).toString(), "foods");
  
          // Get the document ID of the food item to delete
          const mealSnapshot = await getDocs(mealIndexCollectionRef);
          const mealDocs = mealSnapshot.docs;
          const foodDocId = mealDocs[foodIndex].id;
  
          // Delete the food item document from the subcollection
          await deleteDoc(doc(mealIndexCollectionRef, foodDocId));
  
          // Retrieve the mealData from state
          const updatedMealData = [...mealData];
  
          // Remove the selected food from mealData
          updatedMealData[mealIndex] = updatedMealData[mealIndex].filter(
            (_, index) => index !== foodIndex
          );
  
          // Update the state with the modified mealData
          setMealData(updatedMealData);
  
          // Close the modal
          setModalVisible(false);
        } else {
          // Handle case where user data not found
        }
      } else {
        // No user token found, navigate to login
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Error removing food:", error);
      // Handle error
    }
  };
  

  const handleRemoveMeal = (mealIndex) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this meal?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            // Create a copy of mealData
            const updatedMealData = mealData.filter(
              (index) => index !== mealIndex
            );
            // Update the state with the modified mealData
            setMealData(updatedMealData);
            setMealCount(mealCount - 1);
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const handleAddMeal = () => {
    if (mealCount < 8) {
      setMealCount(mealCount + 1);
    }
  };

  const handleFoodDetails = (food) => {
    setFoodData(food);
    setModalVisible(true);
  };

  if (!fontsLoaded) {
    return null; // Return nothing while fonts are loading
  }

  

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Card containerStyle={[styles.card, {marginTop: 24, height: 112}]}>
          <Text style={styles.cardTitle}>Calories Remaining</Text>
          <Divider style={{ marginBottom: 10 }} />
          <Text style={{ fontFamily: "Montserrat-Regular", fontSize: 12 }}>
            Calories remaining are calculated by subtracting the calories from food from the daily calorie goal.
          </Text>
          <Text style={{ fontFamily: "Montserrat-SemiBold", fontSize: 16, alignSelf: "center"}}>
          </Text>
        </Card>

        {Array.from({ length: mealCount }).map((_, mealIndex) => (
          <Card key={mealIndex} containerStyle={styles.card}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealCardTitle}>Meal {mealIndex + 1}</Text>
              <Button 
                icon={<Icon name="trash-can-outline" size={24} color="red" type="material-community"/>}
                type="clear"
                onPress={() => handleRemoveMeal(mealIndex)}
              />
            </View>
            <Divider style={{ marginTop: 4 }} />
            {mealData[mealIndex]?.map((item, foodIndex) => (
              <TouchableOpacity
                key={foodIndex}
                onPress={() => handleFoodDetails(item)}
              >
                <View style={styles.foodItemContainer}>
                  <Text style={styles.foodItemName}>{item.name}</Text>
                  <View style={styles.foodItemDetails}>
                    <Text style={styles.foodItemProperty}>
                      {item.calories}kcal
                    </Text>
                  </View>
                  <Button
                    type="clear" 
                    onPress={() => handleRemoveFood(mealIndex, foodIndex)}
                    icon={<Icon name="remove" size={24} color="red" type="font-awesome"/>}
                  />
                </View>
              </TouchableOpacity>
            ))}

            
              <Button
                title="Add Food"
                titleStyle={{fontFamily: "Montserrat-Regular"}}
                onPress={() => handleAddFoodButtonClicked(mealIndex)}
                containerStyle={{ width: 100, marginTop: 10, alignSelf:"center", borderRadius: 15 }}
                color="#0022ff"
               />
          </Card>
        ))}

        <TouchableOpacity onPress={handleAddMeal}>
          <MaterialCommunityIcons
            name="plus-circle"
            size={48}
            color="#002FF5"
          />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {/* Search food input field */}
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.input}
                    label="Search Food"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  <Button
                    onPress={handleSearch}
                    title="Search"
                    titleStyle={{ fontFamily: "Montserrat-Regular" }}
                    buttonStyle={{ marginBottom: 24 }}
                  />
                </View>

                <View style={{ marginBottom: 12}}>
                  <FlatList
                    data={searchResults}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => handleAddFoodFromSearch(item)}
                      >
                        <Text style={{ fontFamily: "Montserrat-SemiBold" }}>
                          {item.name.charAt(0).toUpperCase() +
                            item.name.slice(1)}
                        </Text>
                        <Text style={{ fontFamily: "Montserrat-Regular" }}>
                          Calories: {item.calories.toString()}
                        </Text>
                        <Text style={{ fontFamily: "Montserrat-Regular" }}>
                          Protein: {item.protein.toString()}
                        </Text>
                        <Text style={{ fontFamily: "Montserrat-Regular" }}>
                          Carbohydrates: {item.carbohydrates.toString()}
                        </Text>
                        <Text style={{ fontFamily: "Montserrat-Regular" }}>
                          Fats: {item.fats.toString()}
                        </Text>
                      </TouchableOpacity>
                    )}
                    style={{ maxHeight: 200 }} // Adjust the height as needed
                  />
                </View>

                {/* Manual entry input fields */}
                <TextInput
                  style={styles.input}
                  label="Food Name"
                  value={foodData.name}
                  onChangeText={(text) =>
                    setFoodData({ ...foodData, name: text })
                  }
                />
                <TextInput
                  style={styles.input}
                  label="Calories"
                  value={foodData.calories}
                  onChangeText={(text) =>
                    setFoodData({ ...foodData, calories: text })
                  }
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  label="Protein (g)"
                  value={foodData.protein}
                  onChangeText={(text) =>
                    setFoodData({ ...foodData, protein: text })
                  }
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  label="Carbohydrates (g)"
                  value={foodData.carbohydrates}
                  onChangeText={(text) =>
                    setFoodData({ ...foodData, carbohydrates: text })
                  }
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  label="Fats (g)"
                  value={foodData.fats}
                  onChangeText={(text) =>
                    setFoodData({ ...foodData, fats: text })
                  }
                  keyboardType="numeric"
                />

                {/* Button to add manually entered food */}
                <Button
                  onPress={handleAddFood}
                  title="Add Food"
                  titleStyle={{ fontFamily: "Montserrat-Regular" }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

export default LogMealScreen;
