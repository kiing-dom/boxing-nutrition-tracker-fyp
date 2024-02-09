import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const LogMealScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Log </Text>
    </View>
  )
}

export default LogMealScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})