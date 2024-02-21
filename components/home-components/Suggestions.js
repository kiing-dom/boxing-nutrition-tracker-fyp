import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Suggestions = () => {
  return (
    <View style={styles.container}>
      <Text>AI Suggestions</Text>
    </View>
  )
}

export default Suggestions

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})