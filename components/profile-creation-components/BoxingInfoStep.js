import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "@rneui/themed";
import RNPickerSelect from "react-native-picker-select";
import { loadAsync } from "expo-font";
import PropTypes from "prop-types";
import * as SplashScreen from "expo-splash-screen";

const BoxingInfoStep = ({
  gender,
  boxingLevel,
  weightClass,
  handleGenderSelection,
  handleBoxingLevelSelection,
  handleWeightClassSelection,
  isStep1NextButtonEnabled,
  handleNextStep,
}) => {
  const getWeightClasses = () => {
    if (boxingLevel === "Amateur" && gender === "Male") {
      return [
        { label: "Minimumweight - 105.8 lbs (48 kg)", value: "Minimumweight" },
        { label: "Flyweight - 112.4 lbs (51 kg)", value: "Flyweight" },
        { label: "Bantamweight - 119 lbs (54 kg)", value: "Bantamweight" },
        { label: "Featherweight - 126 lbs (57 kg)", value: "Featherweight" },
        { label: "Lightweight - 132.3 lbs (60 kg)", value: "Lightweight" },
        {
          label: "Light Welterweight - 140 lbs (63.5 kg)",
          value: "Light Welterweight",
        },
        { label: "Welterweight - 147 lbs (67 kg)", value: "Welterweight" },
        {
          label: "Light Middleweight - 156.5 lbs (71 kg)",
          value: "Light Middleweight",
        },
        { label: "Middleweight - 165.3 lbs (75 kg)", value: "Middleweight" },
        {
          label: "Light Heavyweight - 176.4 lbs (80 kg)",
          value: "Light Heavyweight",
        },
        { label: "Cruiserweight - 189.6 lbs (86 kg)", value: "Cruiserweight" },
        { label: "Heavyweight - 200.6 lbs (92 kg)", value: "Heavyweight" },
        {
          label: "Super Heavyweight - 200.6 lbs+ (92 kg+)",
          value: "Super Heavyweight",
        },
      ];
    } else if (boxingLevel === "Amateur" && gender === "Female") {
      return [
        { label: "Mininumweight - 105.8 lbs (48 kg)", value: "Minimumweight" },
        {
          label: "Light Flyweight - 110.2 lbs (50 kg)",
          value: "Light Flyweight",
        },
        { label: "Flyweight - 114.6 lbs (52 kg)", value: "Flyweight" },
        { label: "Bantamweight - 119 lbs (54 kg)", value: "Bantamweight" },
        { label: "Featherweight - 125.7 lbs (57 kg)", value: "Featherweight" },
        { label: "Lightweight - 132.3 lbs (60 kg", value: "Lightweight" },
        {
          label: "Light Welterweight - 138.9 lbs (63 kg)",
          value: "Light Welterweight",
        },
        { label: "Welterweight - 145.5 lbs (66 kg)", value: "Welterweight" },
        {
          label: "Light Middleweight - 154.3 lbs (70 kg)",
          value: "Light Middleweight",
        },
        { label: "Middleweight - 165.3 lbs (75 kg)", value: "Middleweight" },
        {
          label: "Light Heavyweight - 178.6 lbs (81 kg)",
          value: "Light Heavyweight",
        },
        { label: "Heavyweight - 178.6 lbs+ (81 kg+)", value: "Heavyweight" },
      ];
    } else if (boxingLevel === "Professional" && gender === "Male") {
      return [
        { label: "Minimumweight - 105 lbs (47.6 kg)", value: "Minimumweight" },
        {
          label: "Light Flyweight - 108 lbs (49 kg)",
          value: "Light Flyweight",
        },
        { label: "Flyweight - 112 lbs (50.8 kg)", value: "Flyweight" },
        {
          label: "Super Flyweight - 115 lbs (52.1 kg)",
          value: "Super Flyweight",
        },
        { label: "Bantamweight - 118 lbs (53.5 kg)", value: "Bantamweight" },
        {
          label: "Super Bantamweight - 122 lbs (55.3 kg)",
          value: "Super Bantamweight",
        },
        { label: "Featherweight - 126 lbs (57.1 kg)", value: "Featherweight" },
        {
          label: "Super Featherweight - 130 lbs (59 kg)",
          value: "Super Featherweight",
        },
        { label: "Lightweight - 135 lbs (61.2 kg)", value: "Lightweight" },
        {
          label: "Super Lightweight - 140 lbs (63.5 kg)",
          value: "Super Lightweight",
        },
        { label: "Welterweight - 147 lbs (66.7 kg)", value: "Welterweight" },
        {
          label: "Super Welterweight - 154 lbs (69.9 kg)",
          value: "Super Welterweight",
        },
        { label: "Middleweight - 160 lbs (72.5 kg)", value: "Middleweight" },
        {
          label: "Super Middleweight - 168 lbs (76.2 kg)",
          value: "Super Middleweight",
        },
        {
          label: "Light Heavyweight - 175 lbs (79.4 kg)",
          value: "Light Heavyweight",
        },
        { label: "Cruiserweight - 200 lbs (90.7 kg)", value: "Cruiserweight" },
        { label: "Heavyweight - Unlimited", value: "Heavyweight" },
      ];
    } else if (boxingLevel === "Professional" && gender === "Female") {
      return [
        { label: "Atomweight - 95 lbs (43 kg) or less", value: "Atomweight" },
        { label: "Strawweight - 105 lbs (47.6 kg)", value: "Strawweight" },
        { label: "Mini-Flyweight - 108 lbs (49 kg)", value: "Mini-Flyweight" },
        { label: "Flyweight - 112 lbs (50.8 kg)", value: "Flyweight" },
        {
          label: "Super Flyweight - 115 lbs (52.1 kg)",
          value: "Super Flyweight",
        },
        { label: "Bantamweight - 118 lbs (53.5 kg)", value: "Bantamweight" },
        {
          label: "Super Bantamweight - 122 lbs (55.3 kg)",
          value: "Super Bantamweight",
        },
        { label: "Featherweight - 126 lbs (57.1 kg)", value: "Featherweight" },
        {
          label: "Super Featherweight - 130 lbs (59 kg)",
          value: "Super Featherweight",
        },
        { label: "Lightweight - 135 lbs (61.2 kg)", value: "Lightweight" },
        {
          label: "Light Welterweight - 140 lbs (63.5 kg)",
          value: "Light Welterweight",
        },
        { label: "Welterweight - 147 lbs (66.7 kg)", value: "Welterweight" },
        {
          label: "Light Middleweight - 152 lbs (69.0 kg)",
          value: "Light Middleweight",
        },
        { label: "Middleweight - 154 lbs (69.9 kg)", value: "Middleweight" },
        {
          label: "Super Middleweight - 160 lbs (72.5 kg)",
          value: "Super Middleweight",
        },
        {
          label: "Light Heavyweight - 168 lbs (76.2 kg)",
          value: "Light Heavyweight",
        },
        {
          label: "Super Cruiserweight - 175 lbs (79.4 kg)",
          value: "Super Cruiserweight",
        },
        {
          label: "Heavyweight - 175 lbs+ (79.4 kg) or more",
          value: "Heavyweight",
        },
      ];
    }
    // default case
    return [];
  };

  const [fontsLoaded, setFontsLoaded] = useState(false);

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

  if (!fontsLoaded) {
    return null; // Return nothing while fonts are loading
  }

  return (
    <View>
      <Text
        style={{
          fontFamily: "Montserrat-SemiBold",
          fontSize: 20,
          marginBottom: 0,
        }}
      >
        Boxing Information
      </Text>

      <Text
        style={{
          fontFamily: "Montserrat-Regular",
          fontSize: 12,
          marginBottom: 24,
        }}
      >
        Here you will be asked for your sex and boxing level, in order to get
        the correct weight class options.
      </Text>

      <Text
        style={{
          fontFamily: "Montserrat-SemiBold",
          fontSize: 16,
          marginBottom: 4,
        }}
      >
        Sex
      </Text>
      {/* Picker to Select Gender */}
      <Text
        style={{
          fontFamily: "Montserrat-Regular",
          fontSize: 12,
          marginBottom: 0,
        }}
      >
        Please select your biological sex to ensure we calculate an accurate
        calorie goal for you.
      </Text>

      <RNPickerSelect
        placeholder={{
          label: "Choose your sex...",
          value: null,
          color: "grey",
        }}
        onValueChange={handleGenderSelection}
        items={[
          { label: "Male", value: "Male" },
          { label: "Female", value: "Female" },
        ]}
        value={gender}
        style={{}}
      />

      <Text
        style={{
          fontFamily: "Montserrat-SemiBold",
          fontSize: 16,
          marginBottom: 4,
          marginTop: 30,
        }}
      >
        Boxing Level
      </Text>
      {/* Picker to Select Boxing Level */}
      <RNPickerSelect
        placeholder={{
          label: "Choose your boxing level...",
          value: null,
          color: "grey",
        }}
        onValueChange={handleBoxingLevelSelection}
        items={[
          { label: "Amateur", value: "Amateur" },
          { label: "Professional", value: "Professional" },
        ]}
        value={boxingLevel}
      />

      {/* Picker to select desired weight class based on the selected Boxing Level and Gender */}
      <Text
        style={{
          fontFamily: "Montserrat-SemiBold",
          fontSize: 16,
          marginBottom: 4,
          marginTop: 30,
        }}
      >
        Desired Weight Class
      </Text>
      <RNPickerSelect
        placeholder={{
          label: "Choose a weight class...",
          value: null,
          color: "grey",
        }}
        onValueChange={handleWeightClassSelection}
        items={getWeightClasses()} // Use the function to get weight classes
        value={weightClass}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 32,
        }}
      >
        <Button
          buttonStyle={{ paddingLeft: 24, paddingRight: 24 }}
          title="Next"
          raised
          onPress={handleNextStep}
          color="#8868BD"
          disabled={!isStep1NextButtonEnabled}
          titleStyle={{ fontFamily: "Montserrat-Regular" }}
        />
      </View>
    </View>
  );
};

BoxingInfoStep.propTypes = {
  gender: PropTypes.string,
  boxingLevel: PropTypes.string,
  weightClass: PropTypes.string,
  handleGenderSelection: PropTypes.func.isRequired,
  handleBoxingLevelSelection: PropTypes.func.isRequired,
  handleWeightClassSelection: PropTypes.func.isRequired,
  isStep1NextButtonEnabled: PropTypes.bool.isRequired,
  handleNextStep: PropTypes.func.isRequired,
};

export default BoxingInfoStep;
