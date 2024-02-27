import { StyleSheet, View, KeyboardAvoidingView, Alert} from "react-native";
import React, { useState, useEffect } from "react";
import { Button, Input, Icon } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import PropTypes from 'prop-types';
import { TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts, loadAsync } from "expo-font";
import * as SplashScreen from 'expo-splash-screen'

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const preventHide = SplashScreen.preventAutoHideAsync();

    // Load fonts here
    const loadFonts = async () => {
      await loadAsync({
        'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
        'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf')
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

  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        // User is already logged in, redirect to HomeScreen
        navigation.navigate("Home");
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };

  const logIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Successful login
      console.log("Login successful:", user);

      // Store user data in AsyncStorage
      await AsyncStorage.setItem('userToken', JSON.stringify(user)); // Store user data

      // Navigate to desired screen or perform other actions
      navigation.navigate("Home"); // Replace 'HomeScreen' with your intended screen
    } catch (error) {
      console.error("Login error:", error);

      // Display an error message to the user
      Alert.alert(
        "Login Failed",
        error.message,
        [{ text: "OK", style: "cancel" }],
        { cancelable: false }
      );
    }
  };

  return (
    <KeyboardAvoidingView backgroundColor='#FFFFFF' behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Icon name="lock-closed" type="ionicon" color="#8868BD" size={150} />
      <View style={styles.inputContainer}>
        <TextInput
          label="Email"
          mode="outlined" // Use outlined mode for a clear visual style
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          label="Password"
          mode="outlined"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      {/* Login Button */}
      <Button
        raised
        buttonStyle={{ backgroundColor: "#8868BD" }}
        onPress={logIn}
        containerStyle={styles.button}
        title="Login"
        titleStyle={{ fontFamily: 'Montserrat-Regular' }}
      />
      {/* Register Button */}
      <Button
        raised
        buttonStyle={{ borderColor: "#8868BD", backgroundColor: "transparent" }}
        titleStyle={{ color: "#8868BD", fontFamily: 'Montserrat-Regular' }}
        onPress={() => navigation.navigate("Profile Creation")}
        containerStyle={styles.button}
        title="Register"
        
      />
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
};


LoginScreen.propTypes = {
  navigation: PropTypes.object.isRequired, // Assuming navigation is an object and is required
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  inputContainer: {
    width: 300,
    marginBottom: 24
  },

  button: {
    width: 200,
    marginTop: 10,
    borderRadius: 5,
  },
});
