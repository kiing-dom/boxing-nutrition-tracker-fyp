import React from "react";
import { View } from "react-native";
import { ButtonGroup, Text, Button } from "@rneui/themed";
import PropTypes from "prop-types";

const GoalStep = ({
  weightGoal,
  activityLevel,
  handleWeightGoalSelection,
  handleActivityLevelSelection,
  isStep3NextButtonEnabled,
  handleNextStep,
  handlePreviousStep,
  weightGoals,
  activityLevels,
}) => {
  return (
    <View>
      <Text
        style={{
          fontFamily: "Montserrat-SemiBold",
          fontSize: 20,
          marginBottom: 8,
        }}
      >
        Goals
      </Text>
      <Text
        style={{
          fontFamily: "Montserrat-Regular",
          fontSize: 12,
          color: "grey",
        }}
      >
        This will be used to calculate your calorie total
      </Text>

      <Text
        style={{
          fontFamily: "Montserrat-SemiBold",
          fontSize: 16,
          marginBottom: 4,
          marginTop: 32,
        }}
      >
        Goal
      </Text>
      {/** Toggle Buttons to handle Goal choice */}
      <ButtonGroup
        buttons={weightGoals.map((goals) => goals.label)}
        onPress={handleWeightGoalSelection}
        value={weightGoal}
        vertical
        selectedIndex={weightGoals.findIndex(
          (goal) => goal.label === weightGoal
        )}
        selectedButtonStyle={{ backgroundColor: "#002FF5" }}
        textStyle={{ fontFamily: "Montserrat-Regular" }}
      />

      <Text
        style={{
          fontFamily: "Montserrat-SemiBold",
          fontSize: 16,
          marginBottom: 4,
          marginTop: 32,
        }}
      >
        Activity Level
      </Text>

      <ButtonGroup
        buttons={activityLevels.map((level) => level.label)}
        onPress={handleActivityLevelSelection}
        value={activityLevel}
        vertical
        selectedIndex={activityLevels.findIndex(
          (level) => level.value === activityLevel
        )}
        selectedButtonStyle={{ backgroundColor: "#002FF5" }}
        textStyle={{ fontFamily: "Montserrat-Regular" }}
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
          titleStyle={{ fontFamily:"Montserrat-Regular" }}
        />
        <Button
          raised
          title="Next"
          onPress={handleNextStep}
          color="#002FF5"
          disabled={!isStep3NextButtonEnabled}
          titleStyle={{ fontFamily:"Montserrat-Regular" }}
        />
      </View>
    </View>
  );
};

GoalStep.propTypes = {
  weightGoal: PropTypes.string.isRequired,
  activityLevel: PropTypes.string.isRequired,
  handleWeightGoalSelection: PropTypes.func.isRequired,
  handleActivityLevelSelection: PropTypes.func.isRequired,
  isStep3NextButtonEnabled: PropTypes.bool.isRequired,
  handleNextStep: PropTypes.func.isRequired,
  handlePreviousStep: PropTypes.func.isRequired,
  weightGoals: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  activityLevels: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default GoalStep;
