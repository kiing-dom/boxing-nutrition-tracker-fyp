import React, { useLayoutEffect, useEffect, useState } from "react";
import { View, KeyboardAvoidingView, Alert } from "react-native";
import axios from "axios";
import BoxingInfoStep from "../components/profile-creation-components/BoxingInfoStep";
import PersonalInfoStep from "../components/profile-creation-components/PersonalInfoStep";
import GoalStep from "../components/profile-creation-components/GoalStep";
import CalculateCalorieStep from "../components/profile-creation-components/CalculateCalorieStep";
import { StatusBar } from "expo-status-bar";
import RegisterProfileStep from "../components/profile-creation-components/RegisterProfileStep";
import { app, auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, addDoc, collection } from "firebase/firestore";

const ProfileCreationScreen = ({ navigation }) => {
  // for step control
  const [step, setStep] = useState(1);
  // step 1: boxing information
  const [boxingLevel, setBoxingLevel] = useState("");
  const [gender, setGender] = useState("");
  const [weightClass, setWeightClass] = useState("");
  //step 2: personal information
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [location, setLocation] = useState("");

  //step 3: Setting Goals
  const [weightGoal, setWeightGoal] = useState("");
  const [activityLevel, setActivityLevel] = useState("");

  //step 4: Calculations
  const [bmr, setBMR] = useState(0);
  const [tdee, setTDEE] = useState(0);

  //step ??
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // state variables to track selection status
  //step 1:
  const [isGenderSelected, setIsGenderSelected] = useState(false);
  const [isBoxingLevelSelected, setIsBoxingLevelSelected] = useState(false);
  const [isWeightClassSelected, setIsWeightClassSelected] = useState(false);
  //step 2:
  const [isAgeValid, setIsAgeValid] = useState(false);
  const [isHeightValid, setIsHeightValid] = useState(false);
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [isCurrentWeightValid, setIsCurrentWeightValid] = useState(false);
  //step 3:
  const [isWeightGoalSelected, setIsWeightGoalSelected] = useState(false);
  const [isActivityLevelSelected, setIsActivityLevelSelected] = useState(false);

  //step 5:
  const [isFirstNameValid, setIsFirstNameValid] = useState(false);
  const [isLastNameValid, setIsLastNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  //update selection status when a field is selected
  //FOR STEP 1
  const handleGenderSelection = (value) => {
    setGender(value);
    setIsGenderSelected(value !== null);
  };

  const handleBoxingLevelSelection = (value) => {
    setBoxingLevel(value);
    setIsBoxingLevelSelected(value !== null);
  };

  const handleWeightClassSelection = (value) => {
    setWeightClass(value);
    setIsWeightClassSelected(value !== null);
  };

  //FOR STEP 2
  const handleAgeInput = (value) => {
    setAge(value);
    setIsAgeValid(value >= 16 && value <= 120);
  };

  const handleCurrentWeightChange = (value) => {
    setCurrentWeight(value);
    setIsCurrentWeightValid(value >= 14 && value <= 453);
  };

  const handleHeightChange = (value) => {
    setHeight(value);
    setIsHeightValid(value >= 60 && value <= 243);
  };

  const handleLocationSelection = (value) => {
    setLocation(value);
    setIsLocationSelected(value !== null);
  };

  //FOR STEP 3
  const handleWeightGoalSelection = (value) => {
    setWeightGoal(weightGoals[value].label);
    setIsWeightGoalSelected(value !== null);
  };

  const handleActivityLevelSelection = (value) => {
    setActivityLevel(activityLevels[value].value);
    setIsActivityLevelSelected(value !== null);
  };

  //FOR STEP 5: REGISTRATION FORM
  const handleFirstNameInput = (value) => {
    setFirstName(value);
    setIsFirstNameValid(value !== null || value !== "");
  };

  const handleLastNameInput = (value) => {
    setLastName(value);
    setIsLastNameValid(value !== null || value !== "");
  };

  const handleEmailInput = (value) => {
    setEmail(value);
  };

  const handlePasswordInput = (value) => {
    setPassword(value);
  };

  /**
   * Implementing BMR logic based on user's profile data
   * Using Mifflin-St Jeor Equation for Resting Metabolic Rate
   * BMR for men: BMR = 10 * weight (kg) + 6.25 * height (cm) - 5 * age (years) + 5
   * BMR for women: BMR = 10 * weight (kg) + 6.25 * height (cm) - 5 * age (years) - 161
   */
  const calculateBMR = () => {
    if (gender === "Male") {
      setBMR(Math.floor(10 * currentWeight + 6.25 * height - 5 * age + 5)); // if male
    } else {
      setBMR(Math.floor(10 * currentWeight + 6.25 * height - 5 * age - 161)); // if female
    }
  };

  /**
   * Implementing the TDEE calculation logic based on the user's BMR and activity level
   * using the  Harris-Benedict Equation to estimate TDEE
   * TDEE = BMR * Activity Multiplier
   */
  const calculateTDEE = () => {
    const activityMultipliers = {
      "Sedentary": 1.2,
      "Lightly Active": 1.375,
      "Moderately Active": 1.55,
      "Very Active": 1.725,
      "Extremely Active": 1.9,
    };

    const goalMultiplier =
      weightGoals.find((goal) => goal.label === weightGoal)?.value || 0;

    setTDEE(
      parseInt(bmr * activityMultipliers[activityLevel]) + goalMultiplier
    );
  };

  useEffect(() => {
    if (step === 4) {
      calculateBMR();
      calculateTDEE();
    }
  }, [
    step,
    gender,
    currentWeight,
    height,
    age,
    weightGoal,
    bmr,
    activityLevel,
  ]);

  //enable the "Next Button when all fields have a selection"
  const isStep1NextButtonEnabled =
    isGenderSelected && isBoxingLevelSelected && isWeightClassSelected;

  const isStep2NextButtonEnabled =
    isAgeValid && isCurrentWeightValid && isHeightValid && isLocationSelected;

  const isStep3NextButtonEnabled =
    isWeightGoalSelected && isActivityLevelSelected;

  //function to retrieve weightclasses based on boxingLevel and gender
  const weightGoals = [
    { label: "Lose Weight", value: -500 },
    { label: "Maintain Weight", value: 0 },
    { label: "Gain Weight", value: 500 },
  ];
  const activityLevels = [
    { label: "Sedentary (little or no exercise)", value: "Sedentary" },
    {
      label: "Lightly Active (1-3 days of exercise/week)",
      value: "Lightly Active",
    },
    {
      label: "Moderately Active (3-5 days of exercise/week)",
      value: "Moderately Active",
    },
    { label: "Very Active (6-7 days of exercise/week)", value: "Very Active" },
    {
      label: "Extremely Active (twice daily exercise/physical job)",
      value: "Extremely Active",
    },
  ];

  // using country-state-city API to handle the country values for the location step
  const [countryData, setCountryData] = useState([]);
  useEffect(() => {
    const config = {
      method: "get",
      url: "https://api.countrystatecity.in/v1/countries",
      headers: {
        "X-CSCAPI-KEY":
          "eVdqbFJnRkVZWTN2MTc1T1FTZ1FBNHNmdHZ2d1I3bFFhMFhMb1BXcw==",
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        let count = Object.keys(response.data).length;
        let countryArray = [];
        for (let i = 0; i < count; i++) {
          countryArray.push({
            value: response.data[i].iso2,
            label: response.data[i].name,
          });
        }
        setCountryData(countryArray);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []); //added empty dependency array to useEffect hook so effect is only run once

  const handleNextStep = () => {
    setStep(step + 1);
    console.log("After step increment", { step });
    console.log("activity level is: ", { activityLevel });
    console.log("weight goal level is: ", { weightGoal });
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const register = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Create a new user document in Firestore
      const db = getFirestore(app);
      const docRef = await addDoc(collection(db, "users"), {
        // Add all the user data you want to store, e.g.,
        uid: user.uid,
        firstName,
        lastName,
        email,
        boxingLevel,
        weightClass,
        age,
        currentWeight,
        height,
        location,
        weightGoal,
        activityLevel,
        bmr,
        tdee,
        gender,
        password
      });
  
      console.log("Document written with ID: ", docRef.id);

    // Alert and redirect
    Alert.alert(
      "Success!",
      "Profile created successfully!",
      [
        { text: "OK", onPress: () => navigation.navigate('Login') }, // Replace 'Login' with your login screen name
      ],
      { cancelable: false } // Disable closing without selecting an option
    );

  } catch (error) {
    console.error("Registration error: ", error);
    // Handle registration errors
  }
};

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back to Login",
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, padding: 16 }}>
      <StatusBar style="light" />
      <View style={{ backgroundColor: "#E5E5E5", height: 4, marginBottom: 8 }}>
        <View
          //Progress Bar
          style={{
            backgroundColor: "#5A67D8",
            height: 4,
            width: `${(step / 5) * 100}%`,
          }}
        />
      </View>
      {/* STEP 1: BOXING INFORMATION*/}
      {step === 1 && (
        <BoxingInfoStep
          {...{
            gender,
            boxingLevel,
            weightClass,
            handleGenderSelection,
            handleBoxingLevelSelection,
            handleWeightClassSelection,
            isStep1NextButtonEnabled,
            handleNextStep,
          }}
        />
      )}
      {/* STEP 2: PERSONAL INFORMATION */}
      {step == 2 && (
        <PersonalInfoStep
          {...{
            age,
            currentWeight,
            height,
            location,
            handleAgeInput,
            handleCurrentWeightChange,
            handleHeightChange,
            handleLocationSelection,
            isStep2NextButtonEnabled,
            handleNextStep,
            handlePreviousStep,
            isAgeValid,
            isCurrentWeightValid,
            isHeightValid,
            countryData,
          }}
        />
      )}

      {step === 3 && (
        <GoalStep
          {...{
            weightGoal,
            activityLevel,
            handleWeightGoalSelection,
            handleActivityLevelSelection,
            isStep3NextButtonEnabled,
            handleNextStep,
            handlePreviousStep,
            weightGoals,
            activityLevels,
          }}
        />
      )}

      {step === 4 && (
        <CalculateCalorieStep
          {...{ bmr, tdee, handlePreviousStep, handleNextStep }}
        />
      )}

      {step === 5 && (
        <RegisterProfileStep
          {...{
            firstName,
            lastName,
            email,
            password,
            handleFirstNameInput,
            handleLastNameInput,
            handleEmailInput,
            handlePasswordInput,
            handlePreviousStep,
            register,
          }}
        />
      )}

      <View style={{ height: 24 }} />
    </KeyboardAvoidingView>
  );
};
export default ProfileCreationScreen;
