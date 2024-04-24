import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { auth, db } from "../../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDocs, collection, query, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card, Button, Icon } from "@rneui/themed";
import { List } from "react-native-paper";

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [tdee, setTdee] = useState(null);
  const [currentWeight, setCurrentWeight] = useState(null);
  const [weightGoal, setWeightGoal] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userToken = await AsyncStorage.getItem("userToken");
        if (userToken) {
          const userRef = collection(db, "users");
          const querySnapshot = await getDocs(
            query(userRef, where("uid", "==", JSON.parse(userToken).uid))
          );

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setFirstName(userData.firstName);
            setEmail(userData.email);
            setTdee(userData.tdee);
            setCurrentWeight(userData.currentWeight);
            setWeightGoal(userData.weightGoal);
            setGender(userData.gender);
          } else {
            Alert.alert("User data not found");
          }
        } else {
          // No user token found, navigate to login
          navigation.navigate("Login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error fetching user data");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const userToken = await AsyncStorage.getItem("userToken");
        if (userToken) {
          // If userToken exists, set user state
          setUser(JSON.parse(userToken));

          // Fetch additional user data if available
          setLoading(true);
          const userRef = collection(db, "users");
          const querySnapshot = await getDocs(
            query(userRef, where("uid", "==", JSON.parse(userToken).uid))
          );

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            setUser((prevUser) => ({
              ...prevUser,
              userData: userDoc.data(),
            }));
          }
          setLoading(false);
        } else {
          // No user token found, navigate to login
          navigation.navigate("Login");
        }
      } catch (error) {
        console.error("Error checking user authentication:", error);
        // Handle error
      }
    };

    checkUserAuthentication();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", onPress: () => {}, style: "cancel" },
      {
        text: "Sign Out",
        onPress: async () => {
          try {
            await signOut(auth);
            await AsyncStorage.removeItem("userToken");
          } catch (error) {
            console.error("Error during sign out:", error);
            // Handle error
          }
        },
      },
    ]);
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size={"large"} />;
    } else if (user) {
      return (
        <View style={styles.container}>
        <Text style={[styles.header, { marginBottom: 24 }]}> Profile </Text>

          <Text style={[styles.name, { marginBottom: 2 }]}> {firstName} </Text>
          <View style={styles.informationContainer}>
            <Text style={styles.informationContent}> {email} </Text>
          </View>

          <View style={styles.optionsListContainer}>
            <List.Item 
              title="Edit Profile"
              left={props => <List.Icon {...props} icon="pencil" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate("EditProfile")}
            />
            <></>
            <List.Item 
              title="Sign Out"
              left={props => <List.Icon {...props} icon="logout" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleSignOut}
            />
          </View>

          </View>
          
      );
    } else {
      return <Text>You are not logged in.</Text>;
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fffafa"
  },
  header: {
    fontSize: 32,
    fontFamily: "Montserrat-SemiBold",
  },
  name: {
    fontSize: 24,
    fontFamily: "Montserrat-Regular",
  },

  informationContainer: {},

  informationContent: {
    color: "#787878",
    marginBottom: 32
  },
  optionsListContainer: {
    
  }
});

export default Profile;
