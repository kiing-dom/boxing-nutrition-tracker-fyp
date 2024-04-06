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
  query,
  where,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Card, Divider, Button } from "@rneui/themed";
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
  const [mealData, setMealData] = useState([[]]);
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

  // Calculate remaining calories
  // Update the remainingCalories state in the context
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

  // Function to handle search button click
  const handleSearch = async () => {
    // Call the searchFood function with the search query
    await searchFood(searchQuery);
  };

  const searchFood = async (query) => {
    const appId = "ba6d21c8"; // Replace with your Nutritionix app ID
    const appKey = "e548123dd00b118c47a0f384885b6039"; // Replace with your Nutritionix app key
    const url = `https://trackapi.nutritionix.com/v2/natural/nutrients`;

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
            const mealCollectionRef = collection(userDocRef, "meals");

            // Add the new food to the selected meal's array
            await addDoc(mealCollectionRef, {
              name,
              calories,
              protein,
              carbohydrates,
              fats,
            });

            // Update the state with the modified mealData
            const newMealData = [...mealData];
            newMealData[selectedMealIndex] = [
              ...(newMealData[selectedMealIndex] || []),
              { name, calories, protein, carbohydrates, fats },
            ];
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

          // Reference the "meals" subcollection
          const mealCollectionRef = collection(userDocRef, "meals");

          // Get the document ID of the food item to delete
          const mealSnapshot = await getDocs(mealCollectionRef);
          const mealDocs = mealSnapshot.docs;
          const foodDocId = mealDocs[mealIndex].id;

          // Delete the food item document from the "meals" subcollection
          await deleteDoc(doc(mealCollectionRef, foodDocId));

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

  // Calculate total calories consumed
  let totalCaloriesConsumed = 0;
  mealData.forEach((meal) => {
    meal.forEach((food) => {
      totalCaloriesConsumed += Math.floor(parseFloat(food.calories));
    });
  });

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Card containerStyle={styles.card}>
          <Text style={styles.cardTitle}>Calories Remaining</Text>
          <Divider style={{ marginBottom: 10 }} />
          <Text style={{ fontFamily: "Montserrat-Regular", fontSize: 16 }}>
            Calories - Food = Remaining
          </Text>
          <Text style={{ fontFamily: "Montserrat-Regular", fontSize: 16 }}>
            {tdee} - {totalCaloriesConsumed} = {remainingCalories}
          </Text>
        </Card>

        {Array.from({ length: mealCount }).map((_, mealIndex) => (
          <Card key={mealIndex} containerStyle={styles.card}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealCardTitle}>Meal {mealIndex + 1}</Text>
              <TouchableOpacity onPress={() => handleRemoveMeal(mealIndex)}>
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={24}
                  color="red"
                />
              </TouchableOpacity>
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
                  <TouchableOpacity
                    onPress={() => handleRemoveFood(mealIndex, foodIndex)}
                  >
                    <Text style={styles.removeButton}>x</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => handleAddFoodButtonClicked(mealIndex)}
            >
              <Text style={styles.addButton}>Add Food</Text>
            </TouchableOpacity>
          </Card>
        ))}

        <TouchableOpacity onPress={handleAddMeal}>
          <MaterialCommunityIcons
            name="plus-circle"
            size={48}
            color="#8868BD"
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
