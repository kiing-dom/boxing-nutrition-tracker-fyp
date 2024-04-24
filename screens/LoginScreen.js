import { StyleSheet, View, KeyboardAvoidingView, Alert, ActivityIndicator, Text, Image} from "react-native";
import React, { useState, useEffect } from "react";
import { Button, Input, Icon} from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import PropTypes from 'prop-types';
import { TextInput, Modal } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadAsync } from "expo-font";
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
      SplashScreen.hideAsync();
    };

    loadFonts();

    return () => preventHide;
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          navigation.navigate("Home");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    if (fontsLoaded) {
      checkLoginStatus();
    }
  }, [fontsLoaded, navigation]);

  const logIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await AsyncStorage.setItem('userToken', JSON.stringify(user));
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Login Failed",
        error.message,
        [{ text: "OK", style: "cancel" }],
        { cancelable: false }
      );
    }
  };

  if (!fontsLoaded) {
    // Render a loading indicator while fonts are loading
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#002FF5" />
      </View>
    );
  }

  // Render the login screen content after fonts are loaded
  return (
    <KeyboardAvoidingView backgroundColor='#FFFAFA' behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Image source={require('../assets/logos/transparent-icon.png')} style={{width: 300, height: 300}} />
      <View style={styles.inputContainer}>
        <TextInput
          label={<Text style={{fontFamily: "Montserrat-Regular"}}>Email</Text>}
          mode="outlined" // Use outlined mode for a clear visual style
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          label={<Text style={{fontFamily: "Montserrat-Regular"}}>Password</Text>}
          mode="outlined"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      {/* Login Button */}
      <Button
        raised
        buttonStyle={{ backgroundColor: "#002FF5" }}
        onPress={logIn}
        containerStyle={[styles.button, { backgroundColor: "#0022ff" }]}
        title="Login"
        titleStyle={{ fontFamily: 'Montserrat-Regular', fontSize: 32 }}
      />
      {/* Register Button */}
      <Button
        raised
        buttonStyle={{ borderColor: "#002FF5", backgroundColor: "transparent" }}
        titleStyle={{ color: "#002FF5", fontFamily: 'Montserrat-Regular', fontSize: 32 }}
        onPress={() => navigation.navigate("Profile Creation")}
        containerStyle={styles.button}
        title="Register"
      />
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
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
    marginTop: 10,
    borderRadius: 5,
    width: 250,
    height: 64
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
