import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignInScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text>Sign-in fields will go here.</Text>
      
      <TouchableOpacity 
        onPress={() => router.back()} // Goes back to the welcome screen
        style={styles.backButton}
      >
        <Text>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FDF5E6' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  backButton: { marginTop: 20, padding: 10, backgroundColor: '#ccc', borderRadius: 5 }
});