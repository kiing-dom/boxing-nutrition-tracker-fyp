import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { auth, db } from "../../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDocs, collection, query, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

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
            setUser(prevUser => ({
              ...prevUser,
              userData: userDoc.data()
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
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("userToken");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error during sign out:", error);
      // Handle error
    }
  };

  const renderContent = () => {
    if (loading) {
      return <Text>Loading user data...</Text>;
    } else if (user) {
      return (
        <>
          <Text>Welcome, {user?.userData?.firstName}</Text>
          <Button title="Sign Out" onPress={handleSignOut} />
        </>
      );
    } else {
      return <Text>You are not logged in.</Text>;
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Profile;
