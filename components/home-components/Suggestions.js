import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Alert, Modal } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import OpenAI from 'openai';

const Suggestions = () => {
  const [tdee, setTdee] = useState(null);
  const [currentWeight, setCurrentWeight] = useState(null);
  const [weightGoal, setWeightGoal] = useState("");
  const [gender, setGender] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [responseText, setResponseText] = useState("");

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

  const openai = new OpenAI({ apiKey: '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'});

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
        Alert.alert('Error', 'Failed to generate meal plan. Invalid response format.');
      }
    } catch (error) {
      console.error("Error generating meal plan:", error);
      Alert.alert('Error', 'Failed to generate meal plan. Please try again later.');
    }
  };
  
  const generateTrainingPlan = async () => {
    try {
      const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt: `Generate a boxing training plan for a person with current weight: ${currentWeight}, weight goal: ${weightGoal}, gender: ${gender}.`,
        max_tokens: 1000,
      });
  
      const data = response.data;
      if (data && data.choices && data.choices.length > 0) {
        setResponseText(data.choices[0].text);
        setModalVisible(true);
      } else {
        console.error("Invalid response format:", data);
        Alert.alert('Error', 'Failed to generate training plan. Invalid response format.');
      }
    } catch (error) {
      console.error("Error generating training plan:", error);
      Alert.alert('Error', 'Failed to generate training plan. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>AI Suggestions</Text>
      <Button title="Generate Meal Plan" onPress={generateMealPlan} />
      <Button title="Generate Training Plan" onPress={generateTrainingPlan} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalView}>
          <Text>{responseText}</Text>
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

export default Suggestions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});
