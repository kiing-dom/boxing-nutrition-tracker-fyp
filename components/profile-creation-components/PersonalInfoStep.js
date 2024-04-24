import { View, StyleSheet, ScrollView, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Input, Text, Button } from "@rneui/themed";
import RNPickerSelect from "react-native-picker-select";
import { TextInput } from "react-native-paper";
import { loadAsync } from "expo-font";
import * as SplashScreen from 'expo-splash-screen'
import DateTimePicker from "@mohalla-tech/react-native-date-time-picker";

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

  const [dob, setDob] = useState(new Date()); // state to store date of birth

  const calculateAge = (selectedDate) => {
    const today = new Date();
    const birthYear = selectedDate.getFullYear();
    let calculatedAge = today.getFullYear() - birthYear;

    const birthMonth = selectedDate.getMonth();
    const currentMonth = today.getMonth();

    if (currentMonth < birthMonth) {
      calculatedAge--;
    } else if (currentMonth === birthMonth && today.getDate() < selectedDate.getDate()) {
      calculatedAge--;
    }

    setDob(selectedDate); // update dob state after calculation
    handleAgeInput(calculatedAge.toString()); // update age with calculated value
  };

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
      <Text style={{ fontSize: 20, marginBottom: 16, fontFamily: "Montserrat-SemiBold" }}>
        Personal Information
      </Text>
      {/** Numerical Input to handle setting the user's age */}
      
    <Text style={{fontFamily: "Montserrat-SemiBold", fontSize: 16, marginBottom: 8}}>Date of Birth</Text>
      <DateTimePicker
        value={dob}
        mode="date" // set mode to date
        displayFormat={'DD/MM/YYYY'} // customize display format (optional)
        onChange={calculateAge}
        containerStyle={{marginBottom: 8}}
      />
      {isAgeValid === false && (
        <Text style={{ color: "red", marginBottom: 32, marginTop: -4 }}>
          Enter a valid age (16+)
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
          Enter a valid weight
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
          color="#002FF5"
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
