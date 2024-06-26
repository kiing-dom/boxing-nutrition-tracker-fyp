import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../firebaseConfig";
import { Icon, Button, ButtonGroup } from "@rneui/themed";
import { List, TextInput, Modal, Divider } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";

const EditProfileScreen = () => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");

  const [activityLevel, setActivityLevel] = useState("");
  const [isActivityLevelSelected, setIsActivityLevelSelected] = useState(false);
  const [newActivityLevel, setNewActivityLevel] = useState("");

  const [bmr, setBMR] = useState(0);
  const [newBmr, setNewBmr] = useState(0);

  const [tdee, setTdee] = useState(0);
  const [newTdee, setNewTdee] = useState(0);

  const [currentWeight, setCurrentWeight] = useState(null);

  const [weightGoal, setWeightGoal] = useState("");
  const [newWeightGoal, setNewWeightGoal] = useState("");
  const [isWeightGoalSelected, setIsWeightGoalSelected] = useState(false);

  const [weightClass, setWeightClass] = useState("");
  const [newWeightClass, setNewWeightClass] = useState("");
  const [isWeightClassSelected, setIsWeightClassSelected] = useState(false);


  const [gender, setGender] = useState("");

  const [boxingLevel, setBoxingLevel] = useState("");
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [activityLevelModalVisible, setActivityLevelModalVisible] =
    useState(false);
  const [weightGoalModalVisible, setWeightGoalModalVisible] = useState(false);
  const [weightClassModalVisible, setWeightClassModalVisible] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const handleActivityLevelSelection = (value) => {
    setNewActivityLevel(activityLevels[value].value);
    setIsActivityLevelSelected(value !== null);
  };

  const handleWeightGoalSelection = (value) => {
    setNewWeightGoal(weightGoals[value].label);
    setIsWeightGoalSelected(value !== null);
  };

  const handleWeightClassSelection = (value) => {
    setNewWeightClass(value);
    setIsWeightClassSelected(value !== null);
  };

  const getWeightClasses = () => {
    if (boxingLevel === "Amateur" && gender === "Male") {
      return [
        { label: "Minimumweight - 105.8 lbs (48 kg)", value: "Minimumweight" },
        { label: "Flyweight - 112.4 lbs (51 kg)", value: "Flyweight" },
        { label: "Bantamweight - 119 lbs (54 kg)", value: "Bantamweight" },
        { label: "Featherweight - 126 lbs (57 kg)", value: "Featherweight" },
        { label: "Lightweight - 132.3 lbs (60 kg)", value: "Lightweight" },
        {
          label: "Light Welterweight - 140 lbs (63.5 kg)",
          value: "Light Welterweight",
        },
        { label: "Welterweight - 147 lbs (67 kg)", value: "Welterweight" },
        {
          label: "Light Middleweight - 156.5 lbs (71 kg)",
          value: "Light Middleweight",
        },
        { label: "Middleweight - 165.3 lbs (75 kg)", value: "Middleweight" },
        {
          label: "Light Heavyweight - 176.4 lbs (80 kg)",
          value: "Light Heavyweight",
        },
        { label: "Cruiserweight - 189.6 lbs (86 kg)", value: "Cruiserweight" },
        { label: "Heavyweight - 200.6 lbs (92 kg)", value: "Heavyweight" },
        {
          label: "Super Heavyweight - 200.6 lbs+ (92 kg+)",
          value: "Super Heavyweight",
        },
      ];
    } else if (boxingLevel === "Amateur" && gender === "Female") {
      return [
        { label: "Mininumweight - 105.8 lbs (48 kg)", value: "Minimumweight" },
        {
          label: "Light Flyweight - 110.2 lbs (50 kg)",
          value: "Light Flyweight",
        },
        { label: "Flyweight - 114.6 lbs (52 kg)", value: "Flyweight" },
        { label: "Bantamweight - 119 lbs (54 kg)", value: "Bantamweight" },
        { label: "Featherweight - 125.7 lbs (57 kg)", value: "Featherweight" },
        { label: "Lightweight - 132.3 lbs (60 kg", value: "Lightweight" },
        {
          label: "Light Welterweight - 138.9 lbs (63 kg)",
          value: "Light Welterweight",
        },
        { label: "Welterweight - 145.5 lbs (66 kg)", value: "Welterweight" },
        {
          label: "Light Middleweight - 154.3 lbs (70 kg)",
          value: "Light Middleweight",
        },
        { label: "Middleweight - 165.3 lbs (75 kg)", value: "Middleweight" },
        {
          label: "Light Heavyweight - 178.6 lbs (81 kg)",
          value: "Light Heavyweight",
        },
        { label: "Heavyweight - 178.6 lbs+ (81 kg+)", value: "Heavyweight" },
      ];
    } else if (boxingLevel === "Professional" && gender === "Male") {
      return [
        { label: "Minimumweight - 105 lbs (47.6 kg)", value: "Minimumweight" },
        {
          label: "Light Flyweight - 108 lbs (49 kg)",
          value: "Light Flyweight",
        },
        { label: "Flyweight - 112 lbs (50.8 kg)", value: "Flyweight" },
        {
          label: "Super Flyweight - 115 lbs (52.1 kg)",
          value: "Super Flyweight",
        },
        { label: "Bantamweight - 118 lbs (53.5 kg)", value: "Bantamweight" },
        {
          label: "Super Bantamweight - 122 lbs (55.3 kg)",
          value: "Super Bantamweight",
        },
        { label: "Featherweight - 126 lbs (57.1 kg)", value: "Featherweight" },
        {
          label: "Super Featherweight - 130 lbs (59 kg)",
          value: "Super Featherweight",
        },
        { label: "Lightweight - 135 lbs (61.2 kg)", value: "Lightweight" },
        {
          label: "Super Lightweight - 140 lbs (63.5 kg)",
          value: "Super Lightweight",
        },
        { label: "Welterweight - 147 lbs (66.7 kg)", value: "Welterweight" },
        {
          label: "Super Welterweight - 154 lbs (69.9 kg)",
          value: "Super Welterweight",
        },
        { label: "Middleweight - 160 lbs (72.5 kg)", value: "Middleweight" },
        {
          label: "Super Middleweight - 168 lbs (76.2 kg)",
          value: "Super Middleweight",
        },
        {
          label: "Light Heavyweight - 175 lbs (79.4 kg)",
          value: "Light Heavyweight",
        },
        { label: "Cruiserweight - 200 lbs (90.7 kg)", value: "Cruiserweight" },
        { label: "Heavyweight - Unlimited", value: "Heavyweight" },
      ];
    } else if (boxingLevel === "Professional" && gender === "Female") {
      return [
        { label: "Atomweight - 95 lbs (43 kg) or less", value: "Atomweight" },
        { label: "Strawweight - 105 lbs (47.6 kg)", value: "Strawweight" },
        { label: "Mini-Flyweight - 108 lbs (49 kg)", value: "Mini-Flyweight" },
        { label: "Flyweight - 112 lbs (50.8 kg)", value: "Flyweight" },
        {
          label: "Super Flyweight - 115 lbs (52.1 kg)",
          value: "Super Flyweight",
        },
        { label: "Bantamweight - 118 lbs (53.5 kg)", value: "Bantamweight" },
        {
          label: "Super Bantamweight - 122 lbs (55.3 kg)",
          value: "Super Bantamweight",
        },
        { label: "Featherweight - 126 lbs (57.1 kg)", value: "Featherweight" },
        {
          label: "Super Featherweight - 130 lbs (59 kg)",
          value: "Super Featherweight",
        },
        { label: "Lightweight - 135 lbs (61.2 kg)", value: "Lightweight" },
        {
          label: "Light Welterweight - 140 lbs (63.5 kg)",
          value: "Light Welterweight",
        },
        { label: "Welterweight - 147 lbs (66.7 kg)", value: "Welterweight" },
        {
          label: "Light Middleweight - 152 lbs (69.0 kg)",
          value: "Light Middleweight",
        },
        { label: "Middleweight - 154 lbs (69.9 kg)", value: "Middleweight" },
        {
          label: "Super Middleweight - 160 lbs (72.5 kg)",
          value: "Super Middleweight",
        },
        {
          label: "Light Heavyweight - 168 lbs (76.2 kg)",
          value: "Light Heavyweight",
        },
        {
          label: "Super Cruiserweight - 175 lbs (79.4 kg)",
          value: "Super Cruiserweight",
        },
        {
          label: "Heavyweight - 175 lbs+ (79.4 kg) or more",
          value: "Heavyweight",
        },
      ];
    }
    // default case
    return [];
  };

  const activityLevels = [
    { label: "Sedentary (little or no exercise)", value: "Sedentary" },
    {
      label: "Lightly Active (1-3 days of exercise/week)",
      value: "Lightly Active",
    },
    {
      label: "Moderately Active (3-5 days of exercise/week)",
      value: "Moderately Active",
    },
    { label: "Very Active (6-7 days of exercise/week)", value: "Very Active" },
    {
      label: "Extremely Active (twice daily exercise/physical job)",
      value: "Extremely Active",
    },
  ];

  const weightGoals = [
    { label: "Lose Weight", value: -500 },
    { label: "Maintain Weight", value: 0 },
    { label: "Gain Weight", value: 500 },
  ];

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
            setLastName(userData.lastName);
            setEmail(userData.email);
            setHeight(userData.height);
            setAge(userData.age);
            setActivityLevel(userData.activityLevel);
            setTdee(userData.tdee);
            setCurrentWeight(userData.currentWeight);
            setWeightGoal(userData.weightGoal);
            setWeightClass(userData.weightClass);
            setGender(userData.gender);
            setBoxingLevel(userData.boxingLevel);

            setNewActivityLevel(userData.activityLevel);
            setNewWeightGoal(userData.weightGoal);
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

  /**
   * Implementing BMR logic based on user's profile data
   * Using Mifflin-St Jeor Equation for Resting Metabolic Rate
   * BMR for men: BMR = 10 * weight (kg) + 6.25 * height (cm) - 5 * age (years) + 5
   * BMR for women: BMR = 10 * weight (kg) + 6.25 * height (cm) - 5 * age (years) - 161
   */
  const calculateBMR = () => {
    if (gender === "Male") {
      setNewBmr(Math.floor(10 * currentWeight + 6.25 * height - 5 * age + 5)); // if male
    } else {
      setNewBmr(Math.floor(10 * currentWeight + 6.25 * height - 5 * age - 161)); // if female
    }
  };

  /**
   * Implementing the TDEE calculation logic based on the user's BMR and activity level
   * using the  Harris-Benedict Equation to estimate TDEE
   * TDEE = BMR * Activity Multiplier
   */
  const calculateTDEE = () => {
    const activityMultipliers = {
      Sedentary: 1.2,
      "Lightly Active": 1.375,
      "Moderately Active": 1.55,
      "Very Active": 1.725,
      "Extremely Active": 1.9,
    };

    const goalMultiplier =
      weightGoals.find((goal) => goal.label === weightGoal)?.value || 0;

    setNewTdee(
      parseInt(newBmr * activityMultipliers[newActivityLevel]) + goalMultiplier
    );
  };

  const saveName = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const userRef = collection(db, "users");
    const querySnapshot = await getDocs(
      query(userRef, where("uid", "==", JSON.parse(userToken).uid))
    );
    const userId = querySnapshot.docs[0].id;

    try {
      await updateDoc(doc(db, "users", userId), {
        firstName: newFirstName,
        lastName: newLastName,
      });
      setFirstName(newFirstName);
      setLastName(newLastName);
      setNameModalVisible(false);
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  const saveEmail = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const userRef = collection(db, "users");
    const querySnapshot = await getDocs(
      query(userRef, where("uid", "==", JSON.parse(userToken).uid))
    );
    const userId = querySnapshot.docs[0].id;
    try {
      await updateDoc(doc(db, "users", userId), { email: newEmail });
      setEmail(newEmail);
      setEmailModalVisible(false);
    } catch (error) {
      console.error("Error updating email:", error);
    }
  };

  const saveActivityLevel = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const userRef = collection(db, "users");
    const querySnapshot = await getDocs(
      query(userRef, where("uid", "==", JSON.parse(userToken).uid))
    );
    const userId = querySnapshot.docs[0].id;

    calculateBMR();
    calculateTDEE();

    try {
      await updateDoc(doc(db, "users", userId), {
        activityLevel: newActivityLevel,
        bmr: newBmr,
        tdee: newTdee,
      });
      setActivityLevel(newActivityLevel);
      setActivityLevelModalVisible(false);
    } catch (error) {
      console.error("Error updating activity level:", error);
    }
  };

  const saveWeightGoal = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const userRef = collection(db, "users");
    const querySnapshot = await getDocs(
      query(userRef, where("uid", "==", JSON.parse(userToken).uid))
    );
    const userId = querySnapshot.docs[0].id;

    calculateBMR();
    calculateTDEE();

    try {
      await updateDoc(doc(db, "users", userId), {
        weightGoal: newWeightGoal,
        bmr: newBmr,
        tdee: newTdee,
      });
      setWeightGoal(newWeightGoal);
      setWeightGoalModalVisible(false);
    } catch (error) {
      console.error("Error updating weight goal:", error);
    }
  };

  const saveWeightClass = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const userRef = collection(db, "users");
    const querySnapshot = await getDocs(
      query(userRef, where("uid", "==", JSON.parse(userToken).uid))
    );
    const userId = querySnapshot.docs[0].id;

    try {
      await updateDoc(doc(db, "users", userId), {
        weightClass: newWeightClass,
      });
      setWeightClass(newWeightClass);
      setWeightClassModalVisible(false);
    } catch (error) {
      console.error("Error updating weight class:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <Icon
          style={{}}
          name="account-edit"
          type="material-community"
          size={42}
        />
        <Text style={[styles.header, { marginBottom: 32 }]}>Edit Profile</Text>
      </View>

      <View stlye={styles.editInformationContainer}>
        <List.Section>
          <List.Item
            title="Name"
            description={firstName + " " + lastName}
            left={(props) => <List.Icon {...props} icon="format-letter-case" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => setNameModalVisible(true)}
          />
          <Divider />
          <List.Item
            title="Email"
            description={email}
            left={(props) => <List.Icon {...props} icon="email" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => setEmailModalVisible(true)}
          />
          <Divider />
          <List.Item
            title="Activity Level"
            description={activityLevel}
            left={(props) => <List.Icon {...props} icon="dumbbell" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => setActivityLevelModalVisible(true)}
          />
          <Divider />
          <List.Item
            title="Weight Goal"
            description={weightGoal}
            left={(props) => <List.Icon {...props} icon="flag-checkered" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => setWeightGoalModalVisible(true)}
          />
          <Divider />
          <List.Item
            title="Weight Class"
            description={weightClass}
            left={(props) => <List.Icon {...props} icon="boxing-glove" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => setWeightClassModalVisible(true)}
          />
        </List.Section>
      </View>

      {/* Modals for editing information */}
      <Modal
        onDismiss={() => {
          setNameModalVisible(false);
        }}
        animationType="slide"
        transparent={true}
        visible={nameModalVisible}
        onRequestClose={() => setNameModalVisible(false)}
      >
        {/* Name Modal Content */}
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { width: "80%", height: 300 }]}>
            <Text
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: 24,
                marginBottom: 12,
              }}
            >
              Edit Name
            </Text>
            <TextInput
              value={newFirstName}
              onChangeText={setNewFirstName}
              label="First Name"
            />

            <TextInput
              value={newLastName}
              onChangeText={setNewLastName}
              label="Last Name"
            />
            <Button title="Save" onPress={saveName} />
            <Button title="Cancel" onPress={() => setNameModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <Modal
        onDismiss={() => {
          setEmailModalVisible(false);
        }}
        animationType="slide"
        transparent={true}
        visible={emailModalVisible}
        onRequestClose={() => setEmailModalVisible(false)}
      >
        {/* Email Modal Content */}
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { width: "80%", height: 300 }]}>
            <Text style={styles.header2}> Edit Email</Text>
            <TextInput
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="Enter new email"
            />
            <Button title="Save" onPress={saveEmail} />
            <Button
              title="Cancel"
              onPress={() => setEmailModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

      <Modal
        onDismiss={() => {
          setActivityLevelModalVisible(false);
        }}
        animationType="slide"
        transparent={true}
        visible={activityLevelModalVisible}
        onRequestClose={() => setActivityLevelModalVisible(false)}
      >
        {/* Activity Level Modal Content */}
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { width: "80%", height: 400 }]}>
            <Text style={styles.header2}>Edit Activity Level</Text>
            <ButtonGroup
              buttons={activityLevels.map((level) => level.label)}
              onPress={handleActivityLevelSelection}
              value={activityLevel}
              vertical
              selectedIndex={activityLevels.findIndex(
                (level) => level.value === newActivityLevel
              )}
              selectedButtonStyle={{ backgroundColor: "#002FF5" }}
              textStyle={{ fontFamily: "Montserrat-Regular" }}
              containerStyle={{ marginBottom: 12 }}
            />
            <Button
              raised
              title="Save"
              onPress={saveActivityLevel}
              containerStyle={{ marginBottom: 12 }}
            />
            <Button
              title="Cancel"
              onPress={() => setActivityLevelModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

      {/** Weight Goal Modal */}
      <Modal
        onDismiss={() => {
          setWeightGoalModalVisible(false);
        }}
        animationType="slide"
        transparent={true}
        visible={weightGoalModalVisible}
        onRequestClose={() => setWeightGoalModalVisible(false)}
      >
        {/* Weight Goal Modal Content */}
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { width: "80%", height: 375 }]}>
            <Text style={styles.header2}>Edit Weight Goals</Text>
            {/** Toggle Buttons to handle Goal choice */}
            <ButtonGroup
              containerStyle={{ marginTop: 32, marginBottom: 24 }}
              buttons={weightGoals.map((goals) => goals.label)}
              onPress={handleWeightGoalSelection}
              value={weightGoal}
              vertical
              selectedIndex={weightGoals.findIndex(
                (goal) => goal.label === newWeightGoal
              )}
              selectedButtonStyle={{ backgroundColor: "#002FF5" }}
              textStyle={{ fontFamily: "Montserrat-Regular" }}
            />
            <Button
              title="Save"
              onPress={saveWeightGoal}
              raised
              containerStyle={{ marginBottom: 8 }}
            />
            <Button
              title="Cancel"
              onPress={() => setWeightGoalModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

      <Modal
        onDismiss={() => {
          setWeightClassModalVisible(false);
        }}
        animationType="slide"
        transparent={true}
        visible={weightClassModalVisible}
        onRequestClose={() => setWeightClassModalVisible(false)}
      >
        {/* Weight Class Modal Content */}
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { width: "90%", height: 400 }]}>
            <Text style={styles.header2}>Edit Weight Class</Text>
            <RNPickerSelect
              placeholder={{
                label: "Choose a weight class...",
                value: null,
                color: "grey",
              }}
              onValueChange={handleWeightClassSelection}
              items={getWeightClasses()}
              value={weightClass}
            />
            <Button title="Save" onPress={saveWeightClass} />
            <Button
              title="Cancel"
              onPress={() => setWeightClassModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fffafa",
  },
  header: {
    fontSize: 32,
    fontFamily: "Montserrat-SemiBold",
    alignItems: "center",
  },
  header2: {
    fontSize: 24,
    fontFamily: "Montserrat-Regular",
    alignItems: "center",
    marginBottom: 12,
  },

  editInformationContainer: {
    width: "80%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
});
