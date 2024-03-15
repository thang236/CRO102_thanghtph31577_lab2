import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginSreen from './loginSreen';
import { AuthProvider } from './AuthContext';

import Home from './home';

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <AuthProvider>

      <NavigationContainer>
        <Stack.Navigator initialRouteName='login'>
          <Stack.Screen name='login' component={LoginSreen} options={{ headerShown: false }} />
          <Stack.Screen name='home' component={Home} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>

  )
}

export default App

const styles = StyleSheet.create({})