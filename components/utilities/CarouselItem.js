import React from "react";
import { StyleSheet, View, Image, useWindowDimensions } from "react-native";

const CarouselItem = ({ item }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { width }]}>
      <Image
        source={item.image}
        style={[styles.image, { width: width * 0.75 }]}
        fadeDuration={0}
      />
    </View>
  );
};

export default CarouselItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // Added alignItems to center the image horizontally
    borderRadius: 40,
  },
  image: {
    flex: 1,
    borderRadius: 40,
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
