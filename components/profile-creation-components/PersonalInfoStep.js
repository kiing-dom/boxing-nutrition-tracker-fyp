import { View, Button} from "react-native";
import React from "react";
import PropTypes from "prop-types";
import { Input, Text } from "@rneui/themed";
import RNPickerSelect from 'react-native-picker-select'

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
  countryData

}) => {



  return (
    <View>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
        Step 2: Personal Info
      </Text>
      {/** Numerical Input to handle setting the user's age */}
      <Text style={{ fontSize: 16, marginBottom: 4, marginTop: 32 }}>
        How old are you?
      </Text>
      <Input
        placeholder="Age..."
        keyboardType="numeric"
        value={age}
        onChangeText={handleAgeInput}
      />
      {/** if the age isnt valid render the error message  */}
      {isAgeValid === false && age !== "" && (
        <Text style={{ color: "red", marginBottom: 8, marginTop: -16 }}>
          Age must be between 16 and 120
        </Text>
      )}
      <Text style={{ marginTop: -8 }}>
        We use your age to calculate an accurate calorie goal for you.
      </Text>

      {/* Numerical Input for Height */}
      <Text style={{ fontSize: 16, marginBottom: 4, marginTop: 32 }}>
        What is your current weight?
      </Text>
      <Input
        placeholder="Weight (kg)..."
        keyboardType="numeric"
        value={currentWeight}
        onChangeText={handleCurrentWeightChange}
      />
      {isCurrentWeightValid === false && currentWeight !== "" && (
        <Text style={{ color: "red", marginBottom: 8, marginTop: -16 }}>
          Invalid weight; please enter your correct weight
        </Text>
      )}

      {/* Numerical Input for Height */}
      <Text style={{ fontSize: 16, marginBottom: 4, marginTop: 32 }}>
        How Tall Are You?
      </Text>
      <Input
        placeholder="Height (cm)..."
        keyboardType="numeric"
        value={height}
        onChangeText={handleHeightChange}
      />
      {isHeightValid === false && height !== "" && (
        <Text style={{ color: "red", marginBottom: 8, marginTop: -16 }}>
          Height must be between 60 and 243cm
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
