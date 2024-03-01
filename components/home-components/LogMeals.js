import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal, TouchableWithoutFeedback, ScrollView, Alert } from "react-native";
import { getDocs, collection, query, where, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Card, Divider } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { loadAsync } from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";
import { styles } from "../../styles/LogMealStyles"

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

  const handleAddFood = () => {
    // Check if a meal card is selected
    if (selectedMealIndex !== null) {
      // Extract all nutrition data from foodData
      const { name, calories, protein, carbohydrates, fats } = foodData;
      // Create a copy of mealData
      const newMealData = [...mealData];
      // Add the new food to the selected meal's array
      newMealData[selectedMealIndex] = [
        ...(newMealData[selectedMealIndex] || []),
        { name, calories, protein, carbohydrates, fats },
      ];
      // Update the state with the modified mealData
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
      // Handle case where no meal card is selected
      Alert.alert("Error", "Please select a meal to add food to.");
    }
  };

  // Function to handle clicking on the "Add Food" button of a meal card
  const handleAddFoodButtonClicked = (mealIndex) => {
    setSelectedMealIndex(mealIndex);
    setModalVisible(true);
  };

  const handleRemoveFood = (foodIndex) => {
    // Create a copy of mealData
    const updatedMealData = mealData.map(meal => meal.filter((food, index) => index !== foodIndex));
    // Update the state with the modified mealData
    setMealData(updatedMealData);
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
            const updatedMealData = mealData.filter((index) => index !== mealIndex);
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
  mealData.forEach(meal => {
    meal.forEach(food => {
      totalCaloriesConsumed += parseFloat(food.calories);
    });
  });

  // Calculate remaining calories
  const remainingCalories = tdee - totalCaloriesConsumed;

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
    Calories       -         Food       =     Remaining
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
                    onPress={() => handleRemoveFood(foodIndex)}
                  >
                    <Text style={styles.removeButton}>x</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={() => handleAddFoodButtonClicked(mealIndex)}>
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
                <TouchableOpacity onPress={handleAddFood}>
                  <Text style={styles.addButton}>Add Food</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

export default LogMealScreen;
