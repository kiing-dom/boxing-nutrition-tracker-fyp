import React from "react";
import { View, StyleSheet } from "react-native";
import BottomNav from "../components/navigation/BottomNav";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <BottomNav />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
});
