import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileCreationScreen from './screens/ProfileCreationScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen'
import { loadAsync } from 'expo-font';

const Stack = createNativeStackNavigator();



const globalScreenOptions = {
  headerStyle: { backgroundColor: "#002FF5" },
  headerTitleStyle: { color: "#FFFFFF"},
  headerTintColor: "white",
};

export default function App() {

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const preventHide = SplashScreen.preventAutoHideAsync();

    // Load fonts here
    const loadFonts = async () => {
      await loadAsync({
        'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
        'Montserrat-SemiBold': require('./assets/fonts/Montserrat-SemiBold.ttf')
      });
      setFontsLoaded(true);
    };

    loadFonts().then(() => {
      SplashScreen.hideAsync();
    });

    return () => preventHide;
  }, []);
  
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={globalScreenOptions}>
          {/* Screens */}
          <Stack.Screen name='Login' component={LoginScreen} gestureEnabled={false} options={{ headerShown: false, gestureEnabled: false }}/>
          <Stack.Screen name="Profile Creation" component={ProfileCreationScreen} options={{ title: "Create Your Profile"}} />
          <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false, gestureEnabled: false }} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}
