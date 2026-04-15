import React, {useEffect, useRef, useState} from "react";
import {router} from 'expo-router';
import {View, Text, ScrollView, Image, ImageBackground, TouchableOpacity, StyleSheet, Animated, Dimensions, SafeAreaView} from "react-native";

const {width} = Dimensions.get("window");

const levels = [
    {id: 1, title: "One-to-one correspondence", x:50, y:1200, unlocked: true, color: '#5cbbcc'},
    {id: 2, title: "Subitizing", x: 50, y: 900, unlocked: true, color: '#5cbbcc'},
    {id: 3, title: "Cardinality", x: 235, y: 770, unlocked: false, color: "#e8b536"},
    {id: 4, title: "Shape Sorting", x: 20, y:650, unlocked: false, color: "#e8b536"},
    {id: 5, title: "Comparing Amounts", x: 90, y: 400, unlocked: false, color: "#D9DDE5"},
];

export default function ActivityMap() {
    const [currentLevel, setCurrentLevel] = useState(1);
    const scrollRef = useRef(null);

    const currentNode = levels.find((lvl) => lvl.id === currentLevel);

    const avatarX = useRef(new Animated.Value(currentNode.x + 15)).current;
    const avatarY = useRef(new Animated.Value(currentNode.y - 50)).current;

    useEffect(() => {
        const newNode = levels.find((lvl) => lvl.id === currentLevel);
        Animated.parallel([
            Animated.timing(avatarX, {
                toValue: newNode.x + 18,
                duration: 700,
                useNativeDriver: false,
            }),
            Animated.timing(avatarY, {
                toValue: newNode.y + 80,
                duration: 700, 
                useNativeDriver: false,
            }),
        ]).start();

        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                y: Math.max(newNode.y - 350, 0),
                animated: true,
            });
        }
    }, [currentLevel]);

    const completeLevel = () => {
        if (currentLevel < levels.length) {
            setCurrentLevel(currentLevel + 1);
        }
    };

    return (
        <View style={styles.container}>
            {/*Fullscreen scrollable map */}
            <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <ImageBackground
                        source={require("../assets/images/mapBG.jpeg")}
                        style={styles.mapBackground}
                        resizeMode="cover"
                    >
                        {/* Level nodes */}
                        {levels.map((level) => (
                            <TouchableOpacity
                                key={level.id}
                                style={[styles.levelNode, {left: level.x, top: level.y, backgroundColor: level.color,
                                    opacity: level.unlocked || level.id < currentLevel ? 1 : 0.7,
                                },
                            ]}
                            onPress={() => {
                                if (level.id === 1) {
                                    router.push("/Questions/questions");
                                } else if (level.id === 2) {
                                    router.push("/activities/subitizing");
                                }
                            }}
                            >
                                <Text style={styles.levelEmoji}>
                                    {level.id <= currentLevel ? "⭐" : "🔒"}
                                </Text>
                                <Text style={styles.levelText}>{level.title}</Text>
                            </TouchableOpacity>
                        ))}

                        {/* Avatar Marker */}
                        <Animated.View
                            style={[styles.avatarContainer, {left: avatarX, top: avatarY, }, 

                            ]}
                        >
                            <Image
                                source={require("../assets/images/avatar.jpeg")}
                                style={styles.avatar}
                            />
                        </Animated.View>
                    </ImageBackground>
            </ScrollView>

            <SafeAreaView pointerEvents='box-none' style={styles.topOverlay}>
                <View style={styles.topBar}>
                    {/* I need to change these to icons, later */}
                    <Text style={styles.stat}>⚙️ 6</Text>
                    <Text style={styles.stat}>🔥 20</Text>
                    <Text style={styles.stat}>💎 800</Text>
                    <Text style={styles.stat}>❤️ 4</Text>
                </View>
            </SafeAreaView>
            
            <TouchableOpacity style={styles.completeButton} onPress={completeLevel}>
                <Text style={styles.completeBtnText}>Complete Level</Text>
            </TouchableOpacity>
            
            <SafeAreaView pointerEvents="box-none" style={styles.bottomOverlay}>
                <View style={styles.bottomNav}>
                    {/* I need to change these to icons, later */}
                        <TouchableOpacity>
                            <Image 
                                    source={require("../assets/images/home.png")}
                                    style={styles.navImage}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push("/tabs/achievements")}>
                            <Image 
                                source={require("../assets/images/achievement.png")}
                                style={styles.navAchievement}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push("/tabs/stats")}>
                            <Image 
                                source={require("../assets/images/stats.png")}
                                style={styles.navAchievement}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push("/tabs/profileSettings")}>
                            <Image 
                                source={require("../assets/images/avatar.jpeg")}
                                style={styles.navImageAvatar}
                            />
                        </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: "#5cbbcc",
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: "space-around",
        backgroundColor: "#FFFFFF",
        marginHorizontal: 18,
        marginTop: 12, 
        paddingVertical: 12,
        borderRadius: 25,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 5,
    },
    stat: {
        fontSize: 18,
        fontWeight: '800',
        color: "#5cbbcc",
    },
    scrollContainer: {
        paddingBottom: 160,
    },
    mapBackground: {
        width: width,
        height: 1500,
    },
    topOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,   
    },
    /* Add pathOverlay here when found" */
    levelNode: {
        position: "absolute",
        width: 86,
        height: 86,
        borderRadius: 43,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: "#ffffff",
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 6, 
        elevation: 6,
    }, 
    levelEmoji: {
        fontSize: 22,
    },
    levelText: {
        marginTop: 4,
        fontSize: 11,
        fontWeight: "800",
        color: "#fff",
        textAlign: "center",
    },
    avatarContainer: {
        position: "absolute",
        width: 48, 
        height: 48, 
        zIndex: 25,
    },
    avatar: {
        width: 48, 
        height: 48,
        borderRadius: 24,
        borderWidth: 3, 
        borderColor: '#fff',
    },
    completeButton: {
        position: "absolute",
        bottom: 105,
        alignSelf: "center",
        backgroundColor: "#FFB800",
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: "#000",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 6,
    },
    completeBtnText: {
        color: "#000",
        fontWeight: "900",
        fontSize: 16,
    },
    bottomOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
    },

    bottomNav: {
        marginHorizontal: 24,
        marginBottom: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: 32,
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 14,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 8,
    },
    navImage: {
        width: 30,
        height: 30,
        resizeMode: "contain",
    },
    navAchievement : {
        width: 40,
        height: 40,
        resizeMode: "contain",
    },

    navImageAvatar: {
        width: 32, 
        height: 32,
        borderRadius: 16,
        borderWidth: 2, 
        borderColor: '#5cbbcc',
    },
});