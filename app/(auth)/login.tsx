import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Animated, Easing } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { login } from '../../services/authService';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState({
        email: false,
        password: false
    });
    const [secureText, setSecureText] = useState(true);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        // Animate on mount
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        if (isLoading) return;
        setIsLoading(true);

        try {
            await login(email, password);
            router.push('/');
            alert('Login successful!');
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#667eea', '#764ba2']}
            className="flex-1"
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView 
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 items-center justify-center p-8">
                        <Animated.View 
                            className="w-full max-w-md"
                            style={{
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }}
                        >
                            {/* Header */}
                            <View className="items-center mb-12">
                                <View className="bg-white/10 p-5 rounded-full mb-4">
                                    <Ionicons name="briefcase" size={40} color="white" />
                                </View>
                                <Text className="text-4xl font-bold text-white mb-2">Sass-Money</Text>
                                <Text className="text-lg text-white/80">Welcome Back</Text>
                            </View>
                            
                            {/* Form Container */}
                            <View className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                                {/* Email Input */}
                                <View className="mb-6">
                                    <Text className="text-white text-sm font-medium mb-3 ml-1">Email</Text>
                                    <View className={`flex-row items-center rounded-2xl ${isFocused.email ? 'bg-white/20 border-white' : 'bg-white/10 border-white/10'} border p-1 pl-4`}>
                                        <Ionicons name="mail-outline" size={20} color="white" style={{ opacity: 0.7 }} />
                                        <TextInput 
                                            placeholder="Enter your email" 
                                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                            className="flex-1 p-3 text-white ml-2"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            value={email}
                                            onChangeText={setEmail}
                                            onFocus={() => setIsFocused({...isFocused, email: true})}
                                            onBlur={() => setIsFocused({...isFocused, email: false})}
                                        />
                                    </View>
                                </View>
                                
                                {/* Password Input */}
                                <View className="mb-8">
                                    <Text className="text-white text-sm font-medium mb-3 ml-1">Password</Text>
                                    <View className={`flex-row items-center rounded-2xl ${isFocused.password ? 'bg-white/20 border-white' : 'bg-white/10 border-white/10'} border p-1 pl-4`}>
                                        <Ionicons name="lock-closed-outline" size={20} color="white" style={{ opacity: 0.7 }} />
                                        <TextInput 
                                            placeholder="Enter your password" 
                                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                            className="flex-1 p-3 text-white ml-2"
                                            secureTextEntry={secureText}
                                            value={password}
                                            onChangeText={setPassword}
                                            onFocus={() => setIsFocused({...isFocused, password: true})}
                                            onBlur={() => setIsFocused({...isFocused, password: false})}
                                        />
                                        <Pressable 
                                            onPress={() => setSecureText(!secureText)}
                                            className="p-3"
                                        >
                                            <Ionicons 
                                                name={secureText ? "eye-outline" : "eye-off-outline"} 
                                                size={20} 
                                                color="white" 
                                                style={{ opacity: 0.7 }} 
                                            />
                                        </Pressable>
                                    </View>
                                </View>
                                
                                {/* Login Button */}
                                <Pressable 
                                    className={`rounded-2xl overflow-hidden ${isLoading ? 'opacity-80' : ''}`}
                                    onPress={handleLogin}
                                    disabled={isLoading}
                                >
                                    <LinearGradient
                                        colors={['#ff6b6b', '#ff8e53']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        className="p-4 items-center"
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator size="small" color="#fff" />
                                        ) : (
                                            <Text className="text-white font-bold text-lg">Sign In</Text>
                                        )}
                                    </LinearGradient>
                                </Pressable>
                                
                                {/* Divider */}
                                <View className="flex-row items-center my-8">
                                    <View className="flex-1 h-px bg-white/30" />
                                    <Text className="text-white/70 mx-4">or</Text>
                                    <View className="flex-1 h-px bg-white/30" />
                                </View>
                                
                                {/* Social Login */}
                                <View className="flex-row justify-center space-x-4 mb-8">
                                    <Pressable className="bg-white/10 p-3 rounded-xl">
                                        <Ionicons name="logo-google" size={24} color="white" />
                                    </Pressable>
                                    <Pressable className="bg-white/10 p-3 rounded-xl">
                                        <Ionicons name="logo-facebook" size={24} color="white" />
                                    </Pressable>
                                    <Pressable className="bg-white/10 p-3 rounded-xl">
                                        <Ionicons name="logo-apple" size={24} color="white" />
                                    </Pressable>
                                </View>
                                
                                {/* Register Link */}
                                <Pressable 
                                    className="items-center"
                                    onPress={() => router.push('/register')}
                                >
                                    <Text className="text-white/80">
                                        Don't have an account? <Text className="text-white font-semibold">Sign up</Text>
                                    </Text>
                                </Pressable>
                            </View>
                        </Animated.View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

export default Login;