import React, {useState} from "react";
import {
    SafeAreaView,
    View, 
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert
} from "react-native";
import { router } from "expo-router";
import { API_BASE_URL } from "../lib/api";
import { Assets } from "@react-navigation/elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ParentAuthScreen() {
    const [mode, setMode] = useState("login");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const testBackend = async () => {
        try {
            console.log("Testing backend at:", `${API_BASE_URL}/docs`);

            const response = await fetch(`${API_BASE_URL}/docs`);
            const text = await response.text();

            console.log("Backend response status:", response.status);

            if (response.ok){
                Alert.alert("Success", "Backend is reachable!");
            } else {
                Alert.alert("Error", `Backend responded with status ${response.status}`);
            }
        } catch (error) {
            console.log("Backend test error: ", error);
            Alert.alert("Error", "Could not connect to backend");
        }
    };

    const handleParentAuth = async () => {
        try {
            const endpoint = 
                mode === "login" ? "/parent/login" : "/parent/register";
            
            const body = 
                mode === "login"
                    ? { username, password }
                    : {username, email, password};

            console.log("Calling:", `${API_BASE_URL}${endpoint}`);
            console.log("Body:", body);

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }, 
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert("Error", data.detail || "Something went wrong!");
                return;
            }

            if (mode === "register") {
                Alert.alert("Success", "Parent account created! Please log in.");
                setMode("login");
                setEmail("");
                setPassword("");
                return;
            }

            // if login successful, store the token value and got to parent dashboard
            await AsyncStorage.setItem("token", data.access_token);
            console.log("TOKEN SAVE:", data.access_token);
            Alert.alert("Success", "Logged in successfully!");
            router.replace("/ParentDashboard")
        } catch (error) {
            console.log("Connection error:", error);
            Alert.alert("Error", "Could not connect to server");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}> Parent Page</Text> 

                <View style={styles.toggleRow}>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            mode === "login" && styles.activeToggle,
                        ]}
                        onPress={() => setMode("login")}
                    >
                        <Text style={styles.toggleText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            mode === "register" && styles.activeToggle,
                        ]}
                        onPress={() => setMode("register")}
                    >
                        <Text style={styles.toggleText}>Create Account</Text>
                    </TouchableOpacity>
                </View>

                {/* Inputs */}
                <TextInput
                    style={styles.input}
                    placeholder="username"
                    placeholderTextColor="#7a7a7a"
                    value={username}
                    onChangeText={setUsername}
                />

                {mode === "register" && (
                    <TextInput
                        style={styles.input}
                        placeholder="email"
                        placeholderTextColor="#7a7a7a"
                        value={email}
                        onChangeText={setEmail}
                    />
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#7a7a7a"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {/* Submit */}
                <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={handleParentAuth}
                >
                    <Text style={styles.submitText}>
                        {mode === "login" ? "Log In" : "Create Account"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity  style={[styles.submitBtn, {marginTop: 12}]} onPress={testBackend}>
                    <Text style={styles.backText}>Test Backend</Text>
                </TouchableOpacity>
                
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#5cbbcc',
        justifyContent: "center",
        padding: 24,
    },

    card: {
        backgroundColor: "#FFF9F3",
        borderRadius: 28,
        padding: 24,
        elevation: 6,
    },

    title: {
        fontSize: 30, 
        fontWeight: "900",
        color: "#355c9a",
        textAlign: "center",
        marginBottom: 20,
    },
    toggleRow: {
        flexDirection: "row",
        backgroundColor: "#eaf9fd",
        borderRadius: 18,
        marginBottom: 20,
        overflow: "hidden",
    },
    toggleButton: {
        flex: 1, 
        paddingVertical: 14,
        alignItems: "center",
    },
    activeToggle: {
        backgroundColor: "#FFD45a",
    },
    toggleText: {
        fontWeight: "800",
        color: "#355c9a",
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 18,
        paddingHorizontal: 18,
        paddingVertical: 14,
        marginBottom: 14,
        fontSize: 16,
    },
    submitBtn: {
        backgroundColor:"#f47a6a",
        paddingVertical: 16,
        borderRadius: 24,
        alignItems: "center",
        marginTop: 10,
    },
    submitText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "900",
    },
    backText: {
        textAlign: "center",
        marginTop: 18,
        color: "#355c9a",
        fontWeight: "700",
    },
});