import { Text, StyleSheet, View } from 'react-native'
import React, { Component } from 'react'
import { Button, Input, Image } from '@rneui/themed'
import { StatusBar } from 'expo-status-bar'

export default class ProfileCreationScreen extends Component {
  render() {
    return (
      <View>
        <StatusBar style='light' />
        <Image
            source={{
                uri:
                    "",
            }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({})