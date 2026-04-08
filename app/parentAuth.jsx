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

export default function ParentAuthScreen() {
    const [mode, setMode] = useState("login");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleParentAuth = async () => {
        try {
            const endpoint = 
                mode === "login" ? "/parent/login" : "/parent/register";
            
            const body = 
                mode === "login"
                    ? { username, password }
                    : {username, email, password};

            const response = await fetch("http://127.0.0.1:8000/parent/register", {
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

            Alert.alert("Success", "Logged in successfully!");
            router.push("/createChild");
        } catch (error) {
            Alert.alert("Error", "Could not connect to server");
            console.log(error);
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
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

})