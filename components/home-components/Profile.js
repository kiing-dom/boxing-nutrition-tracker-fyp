import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Button } from "@rneui/themed";
import { auth, db } from "../../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDocs, collection, query, where} from "firebase/firestore";

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        try {
          setLoading(true);

          // Construct the reference with a filter to match current user's uid
          const userRef = collection(db, "users")
            where("uid", "==", user.uid)

          const querySnapshot = await getDocs(userRef);

          if (querySnapshot.empty) {
            console.error("No user document found");
            // Handle the case where no document matches the filter
            // (e.g., display message, redirect to create profile)
          } else {
            const userDoc = querySnapshot.docs[0]; // Access the first (and only) document
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Handle other errors (e.g., network errors, permission issues)
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <View>
        <Text>You are not logged in.</Text>
        <Button title="Login" onPress={() => navigation.navigate("Login")} />
        <Button title="Register" onPress={() => navigation.navigate("Register")} />
      </View>
    );
  }

  // Function to handle user sign out and navigation
  const handleSignOut = async () => {
    try {
      Alert.alert(
        "Sign Out?",
        "Are you sure you want to sign out?",
        [
          { text: "No", onPress: () => console.log("Canceled sign out") },
          {
            text: "Yes",
            onPress: async () => {
              await signOut(auth);
              console.log("Signed out successfully");
              navigation.navigate("Login");
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text>Welcome, {userData.firstName}</Text>
        
      </View>
      <Button style={styles.button} title="Sign Out" onPress={handleSignOut} raised />
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