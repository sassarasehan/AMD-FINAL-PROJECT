import { View, Text } from 'react-native'
import React from 'react'
import "./../global.css"
import { Slot, Stack } from 'expo-router'
import { AuthProvider } from '@/context/AuthContext'
import { LoaderProvider } from '@/context/LoaderContext'
import { Gesture, GestureHandlerRootView } from 'react-native-gesture-handler'

const RootLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <LoaderProvider>
        <AuthProvider>
         <Slot />
        </AuthProvider>
      </LoaderProvider>
    </GestureHandlerRootView>
  );
}


export default RootLayout