import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { loadAsync } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileCreationScreen from "./screens/ProfileCreationScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

const Stack = createNativeStackNavigator();

const globalScreenOptions = {
  headerTitleStyle: { color: "#FFFFFF" },
  headerTintColor: "black",
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(null);

  useEffect(() => {
    const preventHide = SplashScreen.preventAutoHideAsync();

    const loadFonts = async () => {
      await loadAsync({
        "Montserrat-Regular": require("./assets/fonts/Montserrat-Regular.ttf"),
        "Montserrat-SemiBold": require("./assets/fonts/Montserrat-SemiBold.ttf"),
      });
      setFontsLoaded(true);
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in.
        await AsyncStorage.setItem("userToken", JSON.stringify(user));
        setUserLoggedIn(true);
      } else {
        // User is signed out.
        await AsyncStorage.removeItem("userToken");
        setUserLoggedIn(false);
      }
    });

    loadFonts();

    return () => {
      unsubscribe();
      preventHide();
    };
  }, []);

  if (!fontsLoaded || userLoggedIn === null) {
    return null; // Return null or loading indicator while fonts are loading or login status is being checked
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        {userLoggedIn ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{ headerTitle: "", headerTransparent: true }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              gestureEnabled={false}
              options={{
                headerShown: false,
                gestureEnabled: false,
                cardOverlayEnable: false,
              }}
            />
            <Stack.Screen
              name="Profile Creation"
              component={ProfileCreationScreen}
              options={{ title: "Create Your Profile" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
