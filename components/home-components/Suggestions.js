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
import { Button, Card } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import OpenAI from "openai";
import MealSlides from "../../assets/slides/MealSlides.js";
import CarouselItem from "../utilities/CarouselItem.js";
import TrainingSlides from "../../assets/slides/TrainingSlides.js";

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
    apiKey: "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",
  });

  const generateMealPlan = async () => {
    try {
      const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt: `Generate a meal plan (for a boxer so 4-6 meals for a day (Meal 1, 2, 3 etc...) show calories of each item and total calories too) for a person with current weight: ${currentWeight}, weight goal: ${weightGoal}, daily calorie goal: ${tdee}, gender: ${gender}.`,
        max_tokens: 600,
      });

      console.log("Response data:", response); // Add this line

      const data = response;
      if (data && data.choices && data.choices.length > 0) {
        setResponseText(data.choices[0].text);
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
        prompt: `Generate a balanced boxing training plan (including rest days) for a person with current weight: ${currentWeight}, weight goal: ${weightGoal}, gender: ${gender}.`,
        max_tokens: 800,
      });

      const data = response;
      if (data && data.choices && data.choices.length > 0) {
        setResponseText(data.choices[0].text);
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
        <Text style={styles.body}>
          Personalized Meal and Training Plans Powered by AI{" "}
        </Text>
      </Card>

      {/* FlatList implementation of carousel for meal images */}

      <Card containerStyle={[styles.cardContainer, {width:"90%"} ]}>
        <View style={styles.flatListContainer}>
          <FlatList
            ref={mealFlatListRef}
            data={MealSlides}
            renderItem={({ item }) => <CarouselItem item={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
            pagingEnabled
            bounces={false}
            onMomentumScrollEnd={() => {
              setSlideIndex(
                Math.ceil(mealFlatListRef.current.contentOffset.x / windowWidth)
              );
            }}
          />
        </View>

        <Button
          titleStyle={{ fontFamily: "Montserrat-SemiBold" }}
          title="GENERATE MEAL PLAN"
          onPress={generateMealPlan}
          containerStyle={{}}
          raised
        />
      </Card>

      {/* FlatList implementation of carousel for training images */}
      <Card containerStyle={[styles.cardContainer, {width:"90%"} ]}>
        <View style={styles.flatListContainer}>
          <FlatList
            ref={trainingFlatListRef}
            data={TrainingSlides}
            renderItem={({ item }) => <CarouselItem item={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
            pagingEnabled
            bounces={false}
            onMomentumScrollEnd={() => {
              setSlideIndex(
                Math.ceil(
                  trainingFlatListRef.current.contentOffset.x / windowWidth
                )
              );
            }}
          />
        </View>

        <Button
          titleStyle={{ fontFamily: "Montserrat-SemiBold" }}
          title="GENERATE TRAINING PLAN"
          onPress={generateTrainingPlan}
          raised
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
  },
  suggestionsCardContainer: {
    height: 96,
    marginBottom: 0,
    borderRadius: 10,
    width: "90%",
    alignSelf: "center"
  },
  flatListContainer: {
    height: 200, // Adjust the height as needed
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Add elevation for Android
    borderRadius: 40, // Adjust the border radius as needed
    opacity: 0.95,
  },
  flatListContent: {
    marginLeft: -32
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
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
    paddingLeft: 16,
    marginBottom: 12,
  },
});
