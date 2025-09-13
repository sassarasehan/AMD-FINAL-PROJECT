import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack screenOptions={{
      headerShown: true, animation: 'slide_from_right'}}>
        <Stack.Screen
            name="login"
            options={{ title: 'Hi Sass' }}
        />
        <Stack.Screen
            name="register"
            options={{ title: 'Register' }}
        />
    </Stack>
  )
}

export default AuthLayout