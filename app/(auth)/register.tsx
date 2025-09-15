import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Animated, Easing, Keyboard, TouchableWithoutFeedback } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { register } from '../../services/authService';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const Register = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false
    });
    const [secureText, setSecureText] = useState({
        password: true,
        confirmPassword: true
    });
    const [keyboardVisible, setKeyboardVisible] = useState(false);

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

        // Keyboard event listeners
        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
            () => setKeyboardVisible(true)
        );
        const keyboardDidHideListener = Keyboard.addListener(
            Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
            () => setKeyboardVisible(false)
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (isLoading) return;
        setIsLoading(true);

        try {
            await register(name, email, password);
            router.back();
            alert('Registration successful! You can now log in.');
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSecureText = (field) => {
        setSecureText({
            ...secureText,
            [field]: !secureText[field]
        });
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <LinearGradient
                colors={['#764ba2', '#667eea']}
                className="flex-1"
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    <ScrollView 
                        contentContainerStyle={{ 
                            flexGrow: 1,
                            paddingBottom: keyboardVisible ? 200 : 0 // Extra padding when keyboard is visible
                        }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="flex-1 items-center justify-center p-8">
                            <Animated.View 
                                className="w-full max-w-md"
                                style={{
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }]
                                }}
                            >
                                {/* Header - Conditionally render when keyboard is not visible */}
                                {!keyboardVisible && (
                                    <View className="items-center mb-10">
                                        <View className="bg-white/10 p-5 rounded-full mb-4">
                                            <Ionicons name="person-add" size={40} color="white" />
                                        </View>
                                        <Text className="text-4xl font-bold text-white mb-2">Sass-Money</Text>
                                        <Text className="text-lg text-white/80">Create Your Account</Text>
                                    </View>
                                )}
                                
                                {/* Form Container */}
                                <View className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                                    {/* Name Input */}
                                    <View className="mb-5">
                                        <Text className="text-white text-sm font-medium mb-3 ml-1">Full Name</Text>
                                        <View className={`flex-row items-center rounded-2xl ${isFocused.name ? 'bg-white/20 border-white' : 'bg-white/10 border-white/10'} border p-1 pl-4`}>
                                            <Ionicons name="person-outline" size={20} color="white" style={{ opacity: 0.7 }} />
                                            <TextInput 
                                                placeholder="Enter your full name" 
                                                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                                className="flex-1 p-3 text-white ml-2"
                                                autoCapitalize="words"
                                                value={name}
                                                onChangeText={setName}
                                                onFocus={() => setIsFocused({...isFocused, name: true})}
                                                onBlur={() => setIsFocused({...isFocused, name: false})}
                                            />
                                        </View>
                                    </View>
                                    
                                    {/* Email Input */}
                                    <View className="mb-5">
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
                                    <View className="mb-5">
                                        <Text className="text-white text-sm font-medium mb-3 ml-1">Password</Text>
                                        <View className={`flex-row items-center rounded-2xl ${isFocused.password ? 'bg-white/20 border-white' : 'bg-white/10 border-white/10'} border p-1 pl-4`}>
                                            <Ionicons name="lock-closed-outline" size={20} color="white" style={{ opacity: 0.7 }} />
                                            <TextInput 
                                                placeholder="Create a password" 
                                                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                                className="flex-1 p-3 text-white ml-2"
                                                secureTextEntry={secureText.password}
                                                value={password}
                                                onChangeText={setPassword}
                                                onFocus={() => setIsFocused({...isFocused, password: true})}
                                                onBlur={() => setIsFocused({...isFocused, password: false})}
                                            />
                                            <Pressable 
                                                onPress={() => toggleSecureText('password')}
                                                className="p-3"
                                            >
                                                <Ionicons 
                                                    name={secureText.password ? "eye-outline" : "eye-off-outline"} 
                                                    size={20} 
                                                    color="white" 
                                                    style={{ opacity: 0.7 }} 
                                                />
                                            </Pressable>
                                        </View>
                                    </View>
                                    
                                    {/* Confirm Password Input */}
                                    <View className="mb-6">
                                        <Text className="text-white text-sm font-medium mb-3 ml-1">Confirm Password</Text>
                                        <View className={`flex-row items-center rounded-2xl ${isFocused.confirmPassword ? 'bg-white/20 border-white' : 'bg-white/10 border-white/10'} border p-1 pl-4`}>
                                            <Ionicons name="lock-closed-outline" size={20} color="white" style={{ opacity: 0.7 }} />
                                            <TextInput 
                                                placeholder="Confirm your password" 
                                                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                                className="flex-1 p-3 text-white ml-2"
                                                secureTextEntry={secureText.confirmPassword}
                                                value={confirmPassword}
                                                onChangeText={setConfirmPassword}
                                                onFocus={() => setIsFocused({...isFocused, confirmPassword: true})}
                                                onBlur={() => setIsFocused({...isFocused, confirmPassword: false})}
                                            />
                                            <Pressable 
                                                onPress={() => toggleSecureText('confirmPassword')}
                                                className="p-3"
                                            >
                                                <Ionicons 
                                                    name={secureText.confirmPassword ? "eye-outline" : "eye-off-outline"} 
                                                    size={20} 
                                                    color="white" 
                                                    style={{ opacity: 0.7 }} 
                                                />
                                            </Pressable>
                                        </View>
                                    </View>
                                    
                                    {/* Register Button */}
                                    <Pressable 
                                        className={`rounded-2xl overflow-hidden ${isLoading ? 'opacity-80' : ''}`}
                                        onPress={handleRegister}
                                        disabled={isLoading}
                                    >
                                        <LinearGradient
                                            colors={['#4facfe', '#00f2fe']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            className="p-4 items-center"
                                        >
                                            {isLoading ? (
                                                <ActivityIndicator size="small" color="#fff" />
                                            ) : (
                                                <Text className="text-white font-bold text-lg">Create Account</Text>
                                            )}
                                        </LinearGradient>
                                    </Pressable>
                                    
                                    {/* Login Link */}
                                    <Pressable 
                                        className="mt-6 items-center"
                                        onPress={() => router.back()}
                                    >
                                        <Text className="text-white/80">
                                            Already have an account? <Text className="text-white font-semibold">Sign in</Text>
                                        </Text>
                                    </Pressable>
                                </View>
                            </Animated.View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>
        </TouchableWithoutFeedback>
    );
};

export default Register;