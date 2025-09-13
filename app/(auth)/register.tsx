import { View, Text, TextInput, Pressable, ActivityIndicator, ImageBackground, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { register } from '@/services/authService';

const Register = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState({
        email: false,
        password: false
    });

    const handleRegister = async () => {
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        if (isLoading) return;
        setIsLoading(true);

        try {
            await register(email, password);
            router.back();
            alert('Registration successful! You can now log in.');
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=1200&q=80' }}
            className="flex-1"
            blurRadius={2}
        >
            <View className="absolute inset-0 bg-black/40" />
            
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView 
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 items-center justify-center p-8">
                        {/* Logo/Header */}
                        <View className="items-center mb-10">
                            <Text className="text-4xl font-bold text-white mb-2">Welcome</Text>
                            <Text className="text-lg text-gray-300">Create your account</Text>
                        </View>
                        
                        {/* Form Container */}
                        <View className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            {/* Email Input */}
                            <View className="mb-5">
                                <Text className="text-gray-300 text-sm font-medium mb-1">Email</Text>
                                <TextInput 
                                    placeholder="Enter your email" 
                                    placeholderTextColor="#9CA3AF"
                                    className={`p-4 rounded-xl ${isFocused.email ? 'bg-white/20 border-blue-400' : 'bg-white/10 border-white/10'} border text-white`}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                    onFocus={() => setIsFocused({...isFocused, email: true})}
                                    onBlur={() => setIsFocused({...isFocused, email: false})}
                                />
                            </View>
                            
                            {/* Password Input */}
                            <View className="mb-6">
                                <Text className="text-gray-300 text-sm font-medium mb-1">Password</Text>
                                <TextInput 
                                    placeholder="Enter your password" 
                                    placeholderTextColor="#9CA3AF"
                                    className={`p-4 rounded-xl ${isFocused.password ? 'bg-white/20 border-blue-400' : 'bg-white/10 border-white/10'} border text-white`}
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                    onFocus={() => setIsFocused({...isFocused, password: true})}
                                    onBlur={() => setIsFocused({...isFocused, password: false})}
                                />
                            </View>
                            
                            {/* Register Button */}
                            <Pressable 
                                className={`bg-blue-600 p-4 rounded-xl items-center justify-center ${isLoading ? 'opacity-80' : ''}`}
                                onPress={handleRegister}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text className="text-white font-bold text-lg">Register</Text>
                                )}
                            </Pressable>
                            
                            {/* Login Link */}
                            <Pressable 
                                className="mt-6 items-center"
                                onPress={() => router.back()}
                            >
                                <Text className="text-gray-300">
                                    Already have an account? <Text className="text-blue-400 font-semibold">Sign in</Text>
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default Register;