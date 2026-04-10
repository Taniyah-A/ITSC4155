import React, {useEffect, useState} from "react";
import {View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../lib/api";
import { router } from "expo-router";

export default function ParentDashboard(){
    const [children, setChildren] = useState([]);

    const fetchChildren = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            const response = await fetch(`${API_BASE_URL}/parent/children`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok){
                console.log(data);
                return;
            }

            setChildren(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchChildren();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Parent Dashboard</Text>
                <Text style={styles.subtitle}>
                    Track your child's learning journey
                </Text>

                <TouchableOpacity style={styles.addButton} onPress={() => router.push("/createChild")}>
                    <Text style={styles.addButtonText}>+ Add Child</Text>
                </TouchableOpacity>

                <FlatList
                    data={children}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 20}}
                    renderItem={({ item }) => (
                        <View style={styles.childCard}>
                            <Text style={styles.name}>{item.username}</Text>
                            <Text style={styles.email}>{item.email}</Text>

                            <View style={styles.progressBadge}>
                                <Text style={styles.progressText}>Progress: New</Text>
                            </View>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#5cbbcc",
        padding: 24,
        justifyContent: "center",
    },
    card: {
        flex: 1,
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
    },
    subtitle: {
        fontSize: 16, 
        fontWeight: "700",
        color: "#355c9a",
        textAlign: "center",
        marginBottom: 20,
        marginTop: 6,
    },
    addButton: {
        backgroundColor: "#ffb800",
        paddingVertical: 14,
        borderRadius: 24,
        alignItems: "center",
        marginBottom: 20,
        borderWidth: 2,
        borderColor: "#000",
        elevation: 5,
    },
    addButtonText: {
        fontSize: 18,
        fontWeight: "900",
        color: "#000",
    },
    childCard: {
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#eee",
    },
    name: {
        fontSize: 18,
        fontWeight: "900",
        color: "#355c9a",
    },
    email: {
        color: "#777",
        marginTop: 4,
    },
    progressBadge: {
        marginTop: 10,
        backgroundColor: "#eaf9fd",
        padding: 8,
        borderRadius: 12,
        alignSelf: "flex-start",
    },
    progressText: {
        fontWeight: "700", 
        color: "#355c9a",
    },

    backButton: {
        alignSelf: "flex-start",
        backgroundColor: "#ffb800",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#000",
        marginBottom: 10,
        elevation: 4,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: "900",
        color: "#000",
    },
});