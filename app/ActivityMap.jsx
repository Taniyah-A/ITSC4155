import React, {useEffect, useRef, useState} from "react";
import {router, useRouter} from 'expo-router';
import {View, Text, ScrollView, Image, ImageBackground, TouchableOpacity, StyleSheet, Animated, Dimensions, SafeAreaView} from "react-native";

const {width} = Dimensions.get("window");

const levels = [
    {id: 1, title: "One-to-one correspondence", x:50, y:1200, unlocked: true, color: "#67FEFF"},
    {id: 2, title: "Subitizing", x: 50, y: 900, unlocked: true, color: "#67FEFF"},
    {id: 3, title: "Cardinality", x: 235, y: 770, unlocked: false, color: "#FECB4F"},
    {id: 4, title: "Shape Sorting", x: 20, y:650, unlocked: false, color: "#FECB4F"},
    {id: 5, title: "Comparing Amounts", x: 90, y: 400, unlocked: false, color: "#D9DDE5"},
];

export default function ActivityMap() {
    const [currentLevel, setCurrentLevel] = useState(1);
    const scrollRef = useRef(null);
    const router = useRouter();
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
                                    router.push("/activities/oneToOne");
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
                        <TouchableOpacity onPress={() => router.push("/ActivityMap")}>
                            <Image 
                                    source={require("../assets/images/home.png")}
                                    style={styles.navImage}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push("/achievements")}>
                            <Image 
                                source={require("../assets/images/achievement.png")}
                                style={styles.navImage}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push("/stats")}>
                            <Image 
                                source={require("../assets/images/stats.png")}
                                style={styles.navImage}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push("/tabs/profile")}>
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
        backgroundColor: "#Aeebff"
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: "space-around",
        backgroundColor: "#FFF9F3",
        marginHorizontal: 18,
        marginTop: 12, 
        paddingVertical: 14,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
    },
    stat: {
        fontSize: 18,
        fontWeight: '700',
        color: "#6e7280",
    },
    scrollContainer: {
        paddingBottom: 160,
    },
    mapWrapper: {
        alignItems: 'center',
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
        width: 82,
        height: 82,
        borderRadius: 41,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 4,
        borderColor: "#ffffff",
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 5, 
        elevation: 5,
    }, 
    levelEmoji: {
        fontSize: 24,
    },
    levelText: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: "700",
        color: "#fff",
        textAlign: "center",
    },
    avatarContainer: {
        position: "absolute",
        width: 46, 
        height: 46, 
        zIndex: 25,
    },
    avatar: {
        width: 46, 
        height: 46,
        borderRadius: 23,
        borderWidth: 3, 
        borderColor: '#fff',
    },
    completeButton: {
        position: "absolute",
        bottom: 105,
        alignSelf: "center",
        backgroundColor: "#F47A6A",
        paddingHorizontal: 22,
        paddingVertical: 12,
        borderRadius: 24,
        zIndex: 25,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 6,
    },
    completeBtnText: {
        color: "#fff",
        fontWeight: "700",
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
        marginHorizontal: 28,
        marginBottom: 18,
        backgroundColor: "#FFFDF8",
        borderRadius: 32,
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    navIcon: {
        fontSize: 24,
        color: "#B8BCC7"
    },
    navImage: {
        width: 30,
        height: 30,
        resizeMode: "contain",
    },

    navImageAvatar: {
        width: 30, 
        height: 30,
        borderRadius: 23,
        borderWidth: 3, 
        borderColor: '#fff',
    },

    activeNav: {
        color: "#57c7ff"
    }
});