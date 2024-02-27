import React, {useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "@rneui/themed";
import { TextInput } from "react-native-paper";
import { loadAsync } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const RegisterProfileStep = ({
  firstName,
  lastName,
  email,
  password,
  handleFirstNameInput,
  handleLastNameInput,
  handleEmailInput,
  handlePasswordInput,
  handlePreviousStep,
  register
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
    <View style={styles.container}>
      <Text style={{fontFamily:"Montserrat-Regular", fontSize: 24, marginBottom: 12, marginRight: 100 }}>
        Create an Account
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="First Name..."
          value={firstName}
          onChangeText={handleFirstNameInput}
          style={{marginBottom: 16}}
        />
        <TextInput
          placeholder="Last Name..."
          value={lastName}
          onChangeText={handleLastNameInput}
          style={{marginBottom: 16}}
        />
        <TextInput
            placeholder="Email..."
            value={email}
            onChangeText={handleEmailInput}
            style={{marginBottom: 16}}
            type="email-address"
        />
        <TextInput 
            placeholder="Password..."
            secureTextEntry
            value={password}
            onChangeText={handlePasswordInput}
            onSubmitEditing={register}
            style={{marginBottom: 16}}
        />
      </View>

      <View style={ styles.buttonContainer}>
        <Button
          containerStyle={styles.previousButton}
          title="Previous"
          onPress={handlePreviousStep}
          color="#7F7F7F"
          titleStyle={{ fontFamily:"Montserrat-Regular"}}
        />

        <Button
          containerStyle={styles.button}
          raised
          title="Create an Account"
          onPress={register}
          color="#8868BD"
          titleStyle={{ fontFamily:"Montserrat-Regular"}}
        />
      </View>
    </View>
  );
};

export default RegisterProfileStep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    backgroundColor: "white"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    alignItems: "center", // Align buttons vertically within container
  },

  button: {
    width: "48%",
    marginTop: 10,
    alignSelf: "center", // Align buttons individually to center
  },

  previousButton: {
    width: "30%",
    marginTop: 10,
    alignSelf: "center"
  },

  inputContainer: {
    width: 325,
  }
});