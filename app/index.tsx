import { View, Text, TouchableOpacity, Animated, Easing } from "react-native";
import React, { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    if (!loading) {
      if (user) {
        setTimeout(() => router.replace("/home/daily"), 1500);
      } else {
        setTimeout(() => router.replace("/login"), 1500);
      }
    }
  }, [user, loading]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (loading) {
    return (
      <LinearGradient
        colors={['#764ba2', '#667eea', '#764ba2']}
        className="flex-1 justify-center items-center"
      >
        <Animated.View 
          style={{ opacity: fadeValue }}
          className="items-center"
        >
          {/* Animated Pig Icon */}
          <Animated.View 
            style={{ transform: [{ scale: scaleValue }] }}
            className="items-center justify-center mb-6"
          >
            {/* Pig Container with Gradient */}
            <LinearGradient
              colors={['#FF9CDA', '#FF85C8', '#FF6BB5']}
              className="w-28 h-28 rounded-full items-center justify-center p-1"
            >
              <View className="bg-white/20 w-full h-full rounded-full items-center justify-center">
                {/* Pig Head */}
                <View className="w-20 h-20 bg-pink-400 rounded-full items-center justify-center border-2 border-pink-600">
                  {/* Pig Snout */}
                  <View className="w-12 h-10 bg-pink-300 rounded-full items-center justify-center">
                    {/* Pig Nose */}
                    <View className="w-8 h-5 bg-pink-500 rounded-full items-center justify-center flex-row">
                      <View className="w-3 h-3 bg-black rounded-full mr-1" />
                      <View className="w-3 h-3 bg-black rounded-full ml-1" />
                    </View>
                  </View>
                  
                  {/* Pig Ears */}
                  <View className="absolute -left-2 -top-1 w-7 h-7 bg-pink-500 rounded-full rotate-45" />
                  <View className="absolute -right-2 -top-1 w-7 h-7 bg-pink-500 rounded-full -rotate-45" />
                  
                  {/* Pig Eyes */}
                  <View className="absolute left-4 top-4 w-2.5 h-2.5 bg-black rounded-full" />
                  <View className="absolute right-4 top-4 w-2.5 h-2.5 bg-black rounded-full" />
                </View>
                
                {/* Pig Tail - Animated */}
                <Animated.View 
                  style={{ transform: [{ rotate: spin }] }}
                  className="absolute -right-6 top-8 w-8 h-2 bg-pink-500 rounded-full"
                />
              </View>
            </LinearGradient>
          </Animated.View>
          
          {/* App Name */}
          <Text className="text-white text-4xl font-bold mb-2">Sass-Money</Text>
          
          {/* Loading Message */}
          <Text className="text-white/80 text-lg">Checking authentication...</Text>
          
          {/* Decorative Elements */}
          <View className="flex-row mt-6">
            <Animated.View 
              style={{ 
                transform: [{ rotate: spin }],
              }}
              className="w-4 h-4 bg-yellow-300 rounded-full mx-1 opacity-70"
            />
            <Animated.View 
              style={{ 
                transform: [{ rotate: spin }],
              }}
              className="w-4 h-4 bg-blue-300 rounded-full mx-1 opacity-70"
            />
            <Animated.View 
              style={{ 
                transform: [{ rotate: spin }],
              }}
              className="w-4 h-4 bg-pink-300 rounded-full mx-1 opacity-70"
            />
          </View>
        </Animated.View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#764ba2', '#667eea', '#764ba2']}
      className="flex-1 justify-center items-center"
    >
      <Animated.View 
        style={{ opacity: fadeValue }}
        className="items-center"
      >
        <Ionicons name="checkmark-circle" size={48} color="white" />
        <Text className="text-white text-lg mt-4">Redirecting...</Text>
        
        {/* Decorative Elements */}
        <View className="flex-row mt-6">
          <Animated.View 
            style={{ 
              transform: [{ rotate: spin }],
            }}
            className="w-4 h-4 bg-yellow-300 rounded-full mx-1 opacity-70"
          />
          <Animated.View 
            style={{ 
              transform: [{ rotate: spin }],
            }}
            className="w-4 h-4 bg-blue-300 rounded-full mx-1 opacity-70"
          />
          <Animated.View 
            style={{ 
              transform: [{ rotate: spin }],
            }}
            className="w-4 h-4 bg-pink-300 rounded-full mx-1 opacity-70"
          />
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

export default Index;