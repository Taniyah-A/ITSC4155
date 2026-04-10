import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { router } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Welcome Text */}
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.brandName}>Brainy Buddy</Text>
        <Text style={styles.subtitle}>Who's Joining today?</Text>

        {/* App Character */}
        <View style={styles.illustrationContainer}>
          <View/>
          <Image 
            source={require("../assets/images/brainyBuddy.png")}
            style={styles.character} 
          />
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonStack}>
          <TouchableOpacity
            style={[styles.button, styles.parentBtn]}
            onPress={() => router.push("/parentAuth")}
          >
            <Text style={styles.buttonText}>I'm a Parent</Text>
            {/* Perhaps add a parent Icon? */}
          </TouchableOpacity>

          <TouchableOpacity
           style={[styles.button, styles.childBtn]}
           onPress={() => router.push("/childLogin")}
          >
            <Text style={styles.buttonText}>I'm a Student</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}> Learning starts here</Text>

      </View>
    </SafeAreaView>
  );
}

// Hex codes:
// '#7EE8FA'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5cbbcc',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  welcomeText: {
    fontSize: 28,
    color: 'white',
    fontWeight: '700',
    marginBottom: -4,
  },
  brandName: {
    fontSize: 42,
    fontWeight: '900',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'black',
    fontWeight: "700",
    marginBottom: 30,
  },
  illustrationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
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
    borderRadius: 80,
  },
  buttonStack: {
    width: '100%',
    maxWidth: 320,
    gap: 16,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    elevation: 5,
  },
  parentBtn: {
    backgroundColor: '#FFB800',
  },
  childBtn: {
    backgroundColor: '#FF6B6B',
    borderColor: '#fff',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  footerText: {
    marginTop: 30,
    fontSize: 16,
    color: "#355C9a",
    fontWeight: "700",
  }
});