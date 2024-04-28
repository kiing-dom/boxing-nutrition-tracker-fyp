import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Modal,
  ScrollView,
  FlatList,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import { Button, Card, Divider, Icon } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import OpenAI from "openai";
import MealSlides from "../../assets/slides/MealSlides.js";
import CarouselItem from "../utilities/CarouselItem.js";
import TrainingSlides from "../../assets/slides/TrainingSlides.js";
import {OPENAI_API_KEY} from '@env';

const Suggestions = () => {
  const [tdee, setTdee] = useState(null);
  const [currentWeight, setCurrentWeight] = useState(null);
  const [weightGoal, setWeightGoal] = useState("");
  const [gender, setGender] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [timerInterval, setTimerInterval] = useState(3000);

  const mealFlatListRef = useRef(null);
  const trainingFlatListRef = useRef(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const windowWidth = Dimensions.get("window").width;
  const { height } = useWindowDimensions();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userToken = await AsyncStorage.getItem("userToken");
        if (userToken) {
          const userRef = collection(db, "users");
          const querySnapshot = await getDocs(
            query(userRef, where("uid", "==", JSON.parse(userToken).uid))
          );

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setTdee(userData.tdee);
            setCurrentWeight(userData.currentWeight);
            setWeightGoal(userData.weightGoal);
            setGender(userData.gender);
          } else {
            Alert.alert("User data not found");
          }
        } else {
          // No user token found, navigate to login
          navigation.navigate("Login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error fetching user data");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (slideIndex === MealSlides.length - 1) {
          setSlideIndex(0);
          mealFlatListRef.current.scrollToIndex({ index: 0 });
          trainingFlatListRef.current.scrollToIndex({ index: 0 });
        } else {
          setSlideIndex(slideIndex + 1);
          mealFlatListRef.current.scrollToIndex({ index: slideIndex + 1 });
          trainingFlatListRef.current.scrollToIndex({ index: slideIndex + 1 });
        }
      },
      slideIndex === MealSlides.length - 1 ? 20000 : 8000
    ); // Adjust the duration here (in milliseconds)

    return () => clearTimeout(timer);
  }, [slideIndex]);

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

  const generateMealPlan = async () => {
    try {
      const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt: `Generate a meal plan for a boxer (4-8 meals for a day (structured as Meal 1, 2, 3 etc...) and show the calories of each item and total calories at the end) for a person with 
        current weight: ${currentWeight},
         weight goal: ${weightGoal}, 
         daily calorie goal: ${tdee}, 
         gender: ${gender}.`,
        max_tokens: 600,
      });

      console.log("Response data:", response); // Add this line

      const data = response;
      if (data?.choices?.length > 0) {
        setResponseText(data.choices[0]?.text);
        setModalVisible(true);
      } else {
        console.error("Invalid response format:", data);
        Alert.alert(
          "Error",
          "Failed to generate meal plan. Invalid response format."
        );
      }
    } catch (error) {
      console.error("Error generating meal plan:", error);
      Alert.alert(
        "Error",
        "Failed to generate meal plan. Please try again later."
      );
    }
  };

  const generateTrainingPlan = async () => {
    try {
      const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt: `Generate a balanced boxing 7 day training plan (including rest days) for a person with 
        current weight: ${currentWeight}, 
        weight goal: ${weightGoal}, 
        gender: ${gender}.`,
        max_tokens: 800,
      });

      const data = response;
      if (data?.choices?.length > 0) {
        setResponseText(data.choices[0]?.text);
        setModalVisible(true);
      } else {
        console.error("Invalid response format:", data);
        Alert.alert(
          "Error",
          "Failed to generate training plan. Invalid response format."
        );
      }
    } catch (error) {
      console.error("Error generating training plan:", error);
      Alert.alert(
        "Error",
        "Failed to generate training plan. Please try again later."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.suggestionsCardContainer}>
        <Text style={styles.heading}>AI Suggestions</Text>
        <Divider />
        <Text style={styles.body}>
          Personalized Meal and Training Plans Powered by AI{" "}
        </Text>
      </Card>

      {/* FlatList implementation of carousel for meal images */}

      <Card containerStyle={[styles.cardContainer, { width: "90%" }]}>
        <View style={styles.flatListContainer}>
          <FlatList
            pointerEvents="none" // Add this line to disable touch events
            ref={mealFlatListRef}
            data={MealSlides}
            renderItem={({ item }) => <CarouselItem item={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
            pagingEnabled
            bounces={false}
            onMomentumScrollEnd={() => {
              if (
                mealFlatListRef.current &&
                mealFlatListRef.current.contentOffset
              ) {
                setSlideIndex(
                  Math.ceil(
                    mealFlatListRef.current.contentOffset.x / windowWidth
                  )
                );
              }
            }}
          />
        </View>

        <Button
          titleStyle={{ fontFamily: "Montserrat-SemiBold" }}
          title=" GENERATE MEAL PLAN"
          onPress={generateMealPlan}
          containerStyle={{}}
          raised
          icon={<Icon name="lunch-dining" size={24} color="#FFFAFA" />}
        />
      </Card>

      {/* FlatList implementation of carousel for training images */}
      <Card containerStyle={[styles.cardContainer, { width: "90%" }]}>
        <View style={styles.flatListContainer}>
          <FlatList
            pointerEvents="none"
            ref={trainingFlatListRef}
            data={TrainingSlides}
            renderItem={({ item }) => <CarouselItem item={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
            pagingEnabled
            bounces={false}
            onMomentumScrollEnd={() => {
              if (
                trainingFlatListRef.current &&
                trainingFlatListRef.current.contentOffset
              ) {
                setSlideIndex(
                  Math.ceil(
                    trainingFlatListRef.current.contentOffset.x / windowWidth
                  )
                );
              }
            }}
          />
        </View>

        <Button
          titleStyle={{ fontFamily: "Montserrat-SemiBold" }}
          title=" GENERATE TRAINING PLAN"
          onPress={generateTrainingPlan}
          raised
          icon={<Icon name="fitness-center" size={24} color="#FFFAFA" />}
        />
      </Card>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalView}>
          <ScrollView style={{ marginBottom: 20 }}>
            <Text style={{ fontFamily: "Montserrat-Regular" }}>
              {responseText}
            </Text>
          </ScrollView>
          <Button
            buttonStyle={[styles.button, {}]}
            title="Close"
            onPress={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Suggestions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    marginBottom: 0,
    borderRadius: 10,
    width: "100%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  suggestionsCardContainer: {
    height: 96,
    marginBottom: 0,
    borderRadius: 10,
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  flatListContainer: {
    height: 200, // Adjust the height as needed
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5, // Add elevation for Android
    borderRadius: 40, // Adjust the border radius as needed
    opacity: 0.95,
  },
  flatListContent: {
    marginLeft: -32,
  },
  modalView: {
    height: 600,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    marginTop: 0,
  },
  heading: {
    alignSelf: "baseline",
    fontSize: 24,
    fontFamily: "Montserrat-SemiBold",
    paddingLeft: 16,
  },
  body: {
    alignSelf: "baseline",
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    paddingLeft: 16,
    marginBottom: 0,
  },
});
