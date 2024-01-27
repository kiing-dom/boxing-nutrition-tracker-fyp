import { Text, StyleSheet, View } from 'react-native';
import React, { Component, useState } from 'react';
import { Button, Input, Image, Icon } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';

const LoginScreen = () => {
  //TODO: add the rest of the state variables
  const [email, setEmail] = useState('');

    return (
      <View>
        <StatusBar style='light' />
        <Icon
            name='lock-closed'
            type='ionicon'
            color='#8868BD'
            size={150}
        />
        <View style={styles.inputContainer}>

          <Input placeholder='Email' type="Email" />
          <Input placeholder='Password' secureTextEntry type="password"/>

        </View>
      </View>
    )
  };

  export default LoginScreen;

const styles = StyleSheet.create({
  inputContainer: {},
});