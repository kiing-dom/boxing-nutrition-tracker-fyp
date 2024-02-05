import React from "react";
import { KeyboardAvoidingView, View, StyleSheet } from "react-native";
import { Text, Input, Button } from "@rneui/themed";

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
  return (
    <View behavior="padding" style={styles.container}>
      <Text h3 style={{ marginBottom: 50 }}>
        Create your Account
      </Text>

      <View style={styles.inputContainer}>
        <Input
          placeholder="First Name..."
          value={firstName}
          onChangeText={handleFirstNameInput}
        />
        <Input
          placeholder="Last Name..."
          value={lastName}
          onChangeText={handleLastNameInput}
        />
        <Input
            placeholder="Email..."
            value={email}
            onChangeText={handleEmailInput}
            type="email-address"
        />
        <Input 
            placeholder="Password..."
            secureTextEntry
            value={password}
            onChangeText={handlePasswordInput}
            onSubmitEditing={register}
        />
      </View>

      <View style={ styles.buttonContainer}>
        <Button
          containerStyle={styles.previousButton}
          title="Previous"
          onPress={handlePreviousStep}
          color="#7F7F7F"
        />

        <Button
          containerStyle={styles.button}
          raised
          title="Register"
          onPress={register}
          color="#8868BD"
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
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    width: 300
  }
});