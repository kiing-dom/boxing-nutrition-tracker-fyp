import { StyleSheet, Text, View, Alert } from "react-native";
import React from "react";
import { Button } from "@rneui/themed";
import { auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";

const Profile = ({ navigation }) => {
  const handleSignOut = async () => {
    // alert confirmation prompt
    try {
      Alert.alert(
        "Sign Out?",
        "Are you sure you want to sign out?",
        [
          { text: "No", onPress: () => console.log("Canceled sign out") },
          {
            text: "Yes",
            onPress: async () => {
              // Sign out and navigate directly within the alert callback
              await signOut(auth);
              console.log("Signed out successfully");
              navigation.navigate("Login");
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error during sign out: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <Button
        style={styles.button}
        title="Sign Out"
        onPress={handleSignOut}
        raised
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    color: "#8868BD",
  },
});
