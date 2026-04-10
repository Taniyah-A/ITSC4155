import React, { useState } from "react";
import {
    View, 
    Text, 
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../lib/api";
import { router } from "expo-router";

export default function CreateChild() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const createChild = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            console.log("TOKEN USED:", token);

            const response = await fetch(`${API_BASE_URL}/parent/create-child`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username, 
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert("Error", data.detail || "Something went wrong");
                return;
            }

            Alert.alert("Success", "Child account created!");

            setUsername("");
            setPassword("");

            // go back to dashboard
            router.back();
        } catch (error){
            console.error(error);
            Alert.alert("Error", "Something went wrong");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Create Child Account</Text>
                <Text style={styles.subtitle}>Add a new learner</Text>

            <TextInput
                placeholder="Child's Name"
                placeholderTextColor="#7a7a7a"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />

            <TextInput 
                placeholder = "Password"
                placeholderTextColor="#7a7a7a"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={createChild}>
                <Text style={styles.buttonText}>Create Child</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 24,
            justifyContent: "center",
            backgroundColor: '#5cbbcc',
        },
        card : {
            backgroundColor: "#fff9f3",
            borderRadius: 28,
            padding: 24,
            elevation: 6,
        },
        title: {
            fontSize: 28,
            fontWeight: "900",
            color: "#355c9a",
            textAlign: "center", 
            marginBottom: 6
        },
        subtitle: {
            fontSize: 16,
            fontWeight: "700",
            color: "#355c9a",
            textAlign: "center",
            marginBottom: 20,
        },
        input: {
            backgroundColor: "#fff",
            borderRadius: 18,
            paddingHorizontal: 18,
            paddingVertical: 14,
            marginBottom: 14,
            fontSize: 16,
        },
        button: {
            backgroundColor: "#ffb800",
            paddingVertical: 16,
            borderRadius: 24,
            alignItems: "center",
            marginTop: 10,
            borderWidth: 2,
            borderColor: "#000",
            elevation: 5,
        },
        buttonText: {
            fontSize: 18,
            fontWeight: "900",
            color: "#000",
        },
        backText: {
            textAlign: "center",
            marginTop: 18,
            color: "#355c9a",
            fontWeight: "700",
        },
    });