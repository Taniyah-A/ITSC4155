import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Link } from 'expo-router'; // This allows you to move to the next page

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Welcome Text */}
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.brandName}>Brainy Buddy</Text>

        {/* Character Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.sunCircle} />
          {/* Replace this URI with your local image: require('../assets/images/your-file.png') */}
          <Image 
            source={{ uri: 'https://via.placeholder.com/150' }} 
            style={styles.character} 
          />
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonStack}>

          {/* Sign in button */}
          <Link href="/SignIn" asChild>
            <TouchableOpacity style={[styles.button, styles.signInBtn]}>
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>
          </Link>

          {/* This Link wraps the button to go to your CreateProfile page */}
          <Link href="/CreateProfile" asChild>
            <TouchableOpacity style={[styles.button, styles.createBtn]}>
              <Text style={[styles.buttonText, { color: 'white' }]}>
                Create an account!
              </Text>
            </TouchableOpacity>
          </Link>

          {/* Temporary button to test the activity map*/}
          <Link href="/ActivityMap" asChild>
            <TouchableOpacity style={[styles.button, { backgroundColor: "#57c7ff"}]}>
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          </Link>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#70F3FF', // The bright blue from your screenshot
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 28,
    color: 'white',
    fontWeight: '600',
    marginBottom: -5,
  },
  brandName: {
    fontSize: 42,
    fontWeight: '900',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    marginBottom: 40,
  },
  illustrationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },
  sunCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FFB800',
  },
  character: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },
  buttonStack: {
    width: '100%',
    maxWidth: 300,
    gap: 15,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    elevation: 5, // Adds shadow on Android
  },
  signInBtn: {
    backgroundColor: '#FFB800',
  },
  createBtn: {
    backgroundColor: '#FF6B6B',
    borderColor: '#fff',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});