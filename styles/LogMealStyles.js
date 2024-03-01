import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: "center",
      paddingVertical: 20,
      paddingHorizontal: 20,
    },
    container: {
      flex: 1,
      alignItems: "center",
    },
    card: {
      width: "100%",
      borderRadius: 10,
      marginBottom: 10,
    },
    cardTitle: {
      textAlign: "center",
      fontFamily: "Montserrat-SemiBold",
      fontSize: 24,
    },
    divider: {
      marginBottom: 10,
    },
    cardText: {
      fontFamily: "Montserrat-Regular",
      fontSize: 16,
    },
    mealHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    mealCardTitle: {
      fontFamily: "Montserrat-SemiBold",
      fontSize: 20,
    },
    addButton: {
      textAlign: "center",
      fontFamily: "Montserrat-Regular",
      fontSize: 16,
      color: "blue",
      marginTop: 10,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      width: "80%",
    },
    input: {
      height: 50,
      borderColor: "#ccc",
      borderWidth: 2,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
  
    foodItemContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    foodItemName: {
      fontSize: 16,
      fontFamily: "Montserrat-Regular",
    },
    foodItemDetails: {
      flexDirection: "row",
      alignItems: "center",
    },
    foodItemProperty: {
      marginLeft: 10,
      color: "#555",
      fontFamily: "Montserrat-Regular",
    },
    removeButton: {
      color: "red",
      fontSize: 20,
    },
  });