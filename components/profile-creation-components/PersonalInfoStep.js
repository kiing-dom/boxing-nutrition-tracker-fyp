import { View, StyleSheet, ScrollView, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Input, Text, Button } from "@rneui/themed";
import RNPickerSelect from "react-native-picker-select";
import { TextInput } from "react-native-paper";
import { loadAsync } from "expo-font";
import * as SplashScreen from 'expo-splash-screen' 

const PersonalInfoStep = ({
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
}) => {

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const preventHide = SplashScreen.preventAutoHideAsync();

    // Load fonts here
    const loadFonts = async () => {
      await loadAsync({
        'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
        'Montserrat-SemiBold': require('../../assets/fonts/Montserrat-SemiBold.ttf')
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
      <Text style={{ fontSize: 20, marginBottom: 8, fontFamily: "Montserrat-SemiBold" }}>
        Personal Information
      </Text>
      {/** Numerical Input to handle setting the user's age */}
      <TextInput
        label="Age..."
        keyboardType="numeric"
        value={age}
        onChangeText={handleAgeInput}
        mode="flat" // Optional: Set the text input mode (flat, outlined, or filled)
        error={!isAgeValid && age !== ""}
        style={{ marginTop: 0, marginBottom: 24 }}
        contentStyle={{ fontFamily: "Montserrat-Regular" }}
      />

      {isAgeValid === false && age !== "" && (
        <Text style={{ color: "red", marginBottom: 8, marginTop: -16 }}>
          Age must be between 16 and 120
        </Text>
      )}

      <TextInput
        label="Weight (kg)..."
        keyboardType="numeric"
        value={currentWeight}
        onChangeText={handleCurrentWeightChange}
        style={{ marginTop: 0, marginBottom: 24 }}
        error={!isCurrentWeightValid && currentWeight != ""}
        contentStyle={{ fontFamily: "Montserrat-Regular" }}
      />

      {isCurrentWeightValid === false && currentWeight !== "" && (
        <Text style={{ color: "red", marginBottom: 8, marginTop: -16 }}>
          Weight must be between 13 and 453
        </Text>
      )}

      <TextInput
        label="Height (cm)..."
        keyboardType="numeric"
        value={height}
        onChangeText={handleHeightChange}
        style={{ marginTop: 0, marginBottom: 24 }}
        error={!isHeightValid && height != ""}
        contentStyle={{ fontFamily: "Montserrat-Regular" }}
      />

      {isHeightValid === false && height !== "" && (
        <Text style={{ color: "red", marginBottom: 8, marginTop: -16 }}>
          Enter a Valid Height
        </Text>
      )}

      {/* Picker to select Location using the Country State City API */}
      <Text style={{fontFamily: "Montserrat-Regular", fontSize: 16, marginBottom: 4, marginTop: 16 }}>
        Location
      </Text>
      <RNPickerSelect
        style={pickerStyle}
        onValueChange={handleLocationSelection}
        items={countryData} // get countries from the countryData array
        value={location}
        
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 32,
        }}
      >
        <Button 
          title="Previous" 
          onPress={handlePreviousStep} 
          color="#7F7F7F"
          titleStyle={{ fontFamily: 'Montserrat-Regular' }}
        />
        <Button
          title="Next"
          onPress={handleNextStep}
          color="#8868BD"
          disabled={!isStep2NextButtonEnabled}
          titleStyle={{ fontFamily: 'Montserrat-Regular' }}
        />
      </View>
    </View>
  );
};

PersonalInfoStep.propTypes = {
  age: PropTypes.string.isRequired,
  currentWeight: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  location: PropTypes.string,
  handleAgeInput: PropTypes.func.isRequired,
  handleCurrentWeightChange: PropTypes.func.isRequired,
  handleHeightChange: PropTypes.func.isRequired,
  handleLocationSelection: PropTypes.func.isRequired,
  isStep2NextButtonEnabled: PropTypes.bool.isRequired,
  handleNextStep: PropTypes.func.isRequired,
  handlePreviousStep: PropTypes.func.isRequired,
  isAgeValid: PropTypes.bool.isRequired,
  isCurrentWeightValid: PropTypes.bool.isRequired,
  isHeightValid: PropTypes.bool.isRequired,
  countryData: PropTypes.array.isRequired,
};

export default PersonalInfoStep;

const pickerStyle = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to make space for the arrow
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to make space for the arrow
  },
  placeholder: {
    color: "gray",
  },
});
