import { Text, StyleSheet, View } from 'react-native';
import React, { Component } from 'react';
import { Button, Input, Image, Icon } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';

export default class LoginScreen extends Component {
  render() {
    return (
      <View>
        <StatusBar style='light' />
        <Icon
            name='lock'
            type='material'
            color='#8868BD'
        />

      </View>
    )
  }
};

const styles = StyleSheet.create({})