import { View, Button, StyleSheet, ScrollView, FlatList } from "react-native";
import React from "react";
import PropTypes from "prop-types";
import { Input, Text } from "@rneui/themed";
import RNPickerSelect from "react-native-picker-select";
import { TextInput } from "react-native-paper";

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
  return (
    <View>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
        Personal Information
      </Text>
      {/** Numerical Input to handle setting the user's age */}
      <Text style={{ fontSize: 16, marginBottom: 4, marginTop: 32 }}>
        How old are you?
      </Text>
      <TextInput
        label="Age..."
        keyboardType="numeric"
        value={age}
        onChangeText={handleAgeInput}
        mode="flat" // Optional: Set the text input mode (flat, outlined, or filled)
        error={!isAgeValid && age !== ""}
        style={{ marginTop: 0, marginBottom: 24 }}
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
      />

{isHeightValid === false && height !== "" && (
        <Text style={{ color: "red", marginBottom: 8, marginTop: -16 }}>
          Enter a Valid Height
        </Text>
      )}

      <Text style={{ marginTop: -8 }}>
        Your height is also a very important factor in calculating an accurate
        calorie goal for you.
      </Text>

      {/* Picker to select Location using the Country State City API */}
      <Text style={{ fontSize: 16, marginBottom: 4, marginTop: 16 }}>
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
        <Button title="Previous" onPress={handlePreviousStep} color="#7F7F7F" />
        <Button
          title="Next"
          onPress={handleNextStep}
          color="#8868BD"
          disabled={!isStep2NextButtonEnabled}
        />
      </View>
    </View>
  );
};

PersonalInfoStep.propTypes = {
  age: PropTypes.string.isRequired,
  currentWeight: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
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
