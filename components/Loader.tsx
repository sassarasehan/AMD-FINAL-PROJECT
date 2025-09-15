import React from "react";
import { View, ActivityIndicator, Animated, Easing } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

interface LoaderProps {
  visible: boolean;
}

const Loader: React.FC<LoaderProps> = ({ visible }) => {
  const spinValue = new Animated.Value(0);
  const scaleValue = new Animated.Value(1);
  
  if (!visible) return null;

  // Rotation animation
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();

  // Pulsating animation
  Animated.loop(
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ])
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View className="absolute inset-0 bg-black/70 items-center justify-center z-50">
      <LinearGradient
        colors={['#FF9CDA', '#9CE3FF', '#FFD966']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-32 h-32 rounded-3xl items-center justify-center p-1"
      >
        <View className="bg-white/90 w-full h-full rounded-2xl items-center justify-center">
          {/* Pig Icon */}
          <Animated.View 
            style={{ transform: [{ scale: scaleValue }] }}
            className="items-center justify-center mb-2"
          >
            {/* Pig Head */}
            <View className="w-16 h-16 bg-pink-400 rounded-full items-center justify-center border-2 border-pink-600">
              {/* Pig Snout */}
              <View className="w-10 h-8 bg-pink-300 rounded-full items-center justify-center">
                {/* Pig Nose */}
                <View className="w-6 h-4 bg-pink-500 rounded-full items-center justify-center flex-row">
                  <View className="w-2 h-2 bg-black rounded-full mr-1" />
                  <View className="w-2 h-2 bg-black rounded-full ml-1" />
                </View>
              </View>
              
              {/* Pig Ears */}
              <View className="absolute -left-2 -top-1 w-6 h-6 bg-pink-500 rounded-full rotate-45" />
              <View className="absolute -right-2 -top-1 w-6 h-6 bg-pink-500 rounded-full -rotate-45" />
              
              {/* Pig Eyes */}
              <View className="absolute left-3 top-3 w-2 h-2 bg-black rounded-full" />
              <View className="absolute right-3 top-3 w-2 h-2 bg-black rounded-full" />
            </View>
            
            {/* Pig Tail - Animated */}
            <Animated.View 
              style={{ transform: [{ rotate: spin }] }}
              className="absolute -right-6 top-6 w-6 h-2 bg-pink-500 rounded-full"
            />
          </Animated.View>
          
          {/* Loading Text */}
          <Animated.Text 
            style={{ transform: [{ scale: scaleValue }] }}
            className="text-pink-600 font-bold text-sm mt-1"
          >
            Loading...
          </Animated.Text>
        </View>
      </LinearGradient>
      
      {/* Floating animated elements */}
      <Animated.View 
        style={{ 
          transform: [{ rotate: spin }],
          top: '30%',
          left: '25%'
        }}
        className="absolute w-6 h-6 bg-yellow-300 rounded-full opacity-70"
      />
      <Animated.View 
        style={{ 
          transform: [{ rotate: spin }],
          top: '40%',
          right: '25%'
        }}
        className="absolute w-5 h-5 bg-blue-300 rounded-full opacity-70"
      />
      <Animated.View 
        style={{ 
          transform: [{ rotate: spin }],
          bottom: '35%',
          left: '30%'
        }}
        className="absolute w-4 h-4 bg-pink-300 rounded-full opacity-70"
      />
    </View>
  );
};

export default Loader;