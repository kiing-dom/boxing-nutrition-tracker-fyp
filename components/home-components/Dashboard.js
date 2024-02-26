import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading'

const Dashboard = () => {

  let [fontsLoaded] = useFonts({
    'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf')
  })

  if(!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <View style={styles.container}>
      <Text style={styles.customText}>Dashboard</Text>
    </View>
  )
}

export default Dashboard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    customText: {
      fontFamily: 'Montserrat-Regular',
    }
})