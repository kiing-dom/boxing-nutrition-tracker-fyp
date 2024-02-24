import { View, StyleSheet } from "react-native";
import { Text, Button } from "@rneui/themed";
import React from "react";
import PropTypes from "prop-types";

const CalculateCalorieStep = ({ bmr, tdee, handlePreviousStep, handleNextStep }) => {
  return (
    <View>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
        Calorie Goal
      </Text>

      {/* Display BMR and TDEE with improved styling */}
      <View style={styles.resultContainer}>
        <Text style={styles.resultLabel}>Your Basal Metabolic Rate (BMR):</Text>
        <Text style={styles.resultValue}>{bmr} calories/day</Text>
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.resultLabel}>
          Your Total Daily Energy Expenditure (TDEE):
        </Text>
        <Text style={styles.resultValue}>{tdee} calories/day</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 32,
        }}
      >
        <Button title="Previous" onPress={handlePreviousStep} color="#7F7F7F" />

        <Button title="Next" onPress={handleNextStep} color="#8868BD" />
        {/* No need for a separate calculate button */}
      </View>
    </View>
  );
};

CalculateCalorieStep.propTypes = {
  bmr: PropTypes.number.isRequired,
  tdee: PropTypes.number.isRequired,
  handlePreviousStep: PropTypes.func.isRequired,
};

export default CalculateCalorieStep;

const styles = StyleSheet.create({
  resultContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#F3F3F3",
    borderRadius: 8,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 18,
    color: "#8868BD",
  },
});
