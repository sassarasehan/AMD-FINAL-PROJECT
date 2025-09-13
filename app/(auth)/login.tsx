import { View, Text, TouchableOpacity, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
// Import your login function from the appropriate service file
import { login } from '../../services/authService';

const Login = () => {
    const router = useRouter()
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    // Handle login logic here

    const handleLogin = async () => {
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        // Call the login function from authService
        await login(email, password)
            .then((res) => {
                router.push('/'); // Redirect to home or dashboard after successful login
                alert('Login successful!');
            })
            .catch((error) => {
                console.error('Login error:', error);
                alert('Login failed. Please try again.');
            })
            .finally(() => {
                setEmail('');
                setPassword('');
            });
    }

  return (
    <View className='flex-1 w-full items-center justify-center align-items-center'>
      <Text>Login to Task Manager</Text>
      <TextInput placeholder='Email' className='border border-gray-300 p-2 rounded-md w-full mb-4' value={email} onChangeText={setEmail} />
      <TextInput placeholder='Password' className='border border-gray-300 p-2 rounded-md w-full mb-4' secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity className='bg-blue-500 p-4 rounded-md w-full' onPress={handleLogin}>
        <Text className='text-white text-center'>Login</Text>
      </TouchableOpacity>
      <Pressable onPress={() => router.push('/register')}>
        <Text className='text-blue-500 mt-4'>Don't have an account? Register</Text>
      </Pressable>
    </View>
  )
}

export default Login