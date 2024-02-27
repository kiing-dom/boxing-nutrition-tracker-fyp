import { View, StyleSheet } from "react-native";
import { Text, Button } from "@rneui/themed";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { loadAsync } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const CalculateCalorieStep = ({
  bmr,
  tdee,
  handlePreviousStep,
  handleNextStep,
}) => {
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
          fontFamily: "Montserrat-Regular",
          fontSize: 20,
          marginBottom: 24,
          alignSelf: "center",
        }}
      >
        Congratulations!
      </Text>

      <View>
        <Text
          style={{
            fontFamily: "Montserrat-Regular",
            fontSize: 12,
            marginBottom: 24,
            alignSelf: "center",
            textAlign: "center",
          }}
        >
          Based on the information you provided {"\n"}
          we were able to calcuate your calorie goal
        </Text>

        <Text
          style={{
            fontFamily: "Montserrat-Regular",
            fontSize: 16,
            marginBottom: 24,
            alignSelf: "center",
            textAlign: "center",
          }}
        >
          Your Daily Calorie Goal Is:
        </Text>

        <Text
          style={{
            fontFamily: "Montserrat-SemiBold",
            fontSize: 48,
            marginBottom: -12,
            alignSelf: "center",
            textAlign: "center",
          }}
        >
          {tdee}
        </Text>

        <Text
          style={{
            fontFamily: "Montserrat-Regular",
            fontSize: 16,
            marginBottom: 30,
            alignSelf: "center",
            textAlign: "center",
          }}
        >
          kcal
        </Text>
      </View>
      <Text
        style={{
          fontFamily: "Montserrat-Regular",
          fontSize: 12,
          marginBottom: 24,
          alignSelf: "center",
          textAlign: "center",
        }}
      >If you're not happy with the results, feel free to return to previous steps to make adjustments</Text>
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
          titleStyle={{ fontFamily: "Montserrat-Regular" }}
        />

        <Button
          title="Next"
          onPress={handleNextStep}
          color="#8868BD"
          titleStyle={{ fontFamily: "Montserrat-Regular" }}
        />
        {/* No need for a separate calculate button */}
      </View>
    </View>
  );
};

CalculateCalorieStep.propTypes = {
  bmr: PropTypes.number.isRequired,
  tdee: PropTypes.number.isRequired,
  handlePreviousStep: PropTypes.func.isRequired,
  handleNextStep: PropTypes.func.isRequired,
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
