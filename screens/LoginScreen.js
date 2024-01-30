import { Text, StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import { Button, Input, Image, Icon } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';

const LoginScreen = ({ navigation }) => {
  //TODO: add the rest of the state variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = (email, password) => {

  };

    return (
      <KeyboardAvoidingView 
        behavior='padding' 
        style={styles.container}
      >
        <StatusBar style='light' />
        <Icon
            name='lock-closed'
            type='ionicon'
            color='#8868BD'
            size={150}
        />
        <View style={styles.inputContainer}>

          <Input 
            placeholder='Email'
            autoFocus 
            type="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Input 
            placeholder='Password' 
            secureTextEntry 
            type="password"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        {/* Login Button */}
        <Button
          buttonStyle={{backgroundColor: '#8868BD'}}
          onPress={signIn} 
          containerStyle={styles.button}
          title='Login' />
        {/* Register Button */}
        <Button
          buttonStyle={{borderColor: '8868BD', backgroundColor: 'transparent'}}
          titleStyle={{color: '#8868BD'}}
          onPress={() => navigation.navigate("Profile Creation")}
          containerStyle={styles.button} 
          type="outline" 
          title="Don't Have a Profile? Register!" 
        />
        <View style={{ height: 100 }} />
      </KeyboardAvoidingView>
    )
  };

  export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,

  },
  inputContainer: {
    width: 300,
  },

  button: {
    width: 200,
    marginTop: 10,
    borderRadius: 5
  },
});