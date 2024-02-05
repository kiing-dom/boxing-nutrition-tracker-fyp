import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileCreationScreen from './screens/ProfileCreationScreen';
import LoginScreen from './screens/LoginScreen';

const Stack = createNativeStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "#8868BD" },
  headerTitleStyle: { color: "#FFFFFF"},
  headerTintColor: "white",
};

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={globalScreenOptions}>
          {/* Screens */}
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name="Profile Creation" component={ProfileCreationScreen} options={{ title: "Create Your Profile"}} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}
