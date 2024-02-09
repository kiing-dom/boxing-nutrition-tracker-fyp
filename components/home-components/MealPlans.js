import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const MealPlans = () => {
  return (
    <View style={styles.container}>
      <Text>Meal Plans</Text>
    </View>
  )
}

export default MealPlans

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})