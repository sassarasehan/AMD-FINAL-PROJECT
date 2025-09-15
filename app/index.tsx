import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { Swipeable } from 'react-native-gesture-handler';

const Index = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/home/daily");
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        className="flex-1 justify-center items-center"
      >
        <View className="items-center">
          <Ionicons name="lock-closed" size={48} color="white" />
          <ActivityIndicator size="large" color="white" className="mt-4" />
          <Text className="text-white mt-2 text-lg">Checking authentication...</Text>
        </View>
      </LinearGradient>
    );
  }

  // This return is unreachable due to the useEffect logic
  // but kept as a fallback
  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      className="flex-1 justify-center items-center"
    >
      <View className="items-center">
        <Ionicons name="alert-circle" size={48} color="white" />
        <Text className="text-white text-lg mt-2">Redirecting...</Text>
        <ActivityIndicator size="small" color="white" className="mt-4" />
      </View>
    </LinearGradient>
  );
};

export default Index;