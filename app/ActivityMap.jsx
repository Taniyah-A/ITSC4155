import React, {useEffect, useRef, useState, useCallback} from "react";
import {router, useFocusEffect} from 'expo-router';
import {View, Text, ScrollView, Image, ImageBackground, TouchableOpacity, StyleSheet, Animated, Dimensions, SafeAreaView} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../lib/api";
import { Audio } from "expo-av";

const {width} = Dimensions.get("window");

const levels = [
    {id: 1, topicId: 1, title: "Counting", x:200, y: 950, color: '#5cbbcc'},
    {id: 2, topicId: 2, title: "Number Recognition", x: 50, y: 900, color: '#5cbbcc'},
    {id: 3, topicId: 3, title: "Basic Addition", x: 235, y: 770, color: "#e8b536"},
    {id: 4, topicId: 4, title: "Basic Subtraction", x: 20, y:650, color: "#e8b536"},
    {id: 5, topicId: 5, title: "Shapes", x: 90, y: 400, color: "#D9DDE5"},
    {id: 6, topicId: 6, title: "Comparing numbers", x: 250, y: 150, color: "#D9DDE5"},
];

export default function ActivityMap() {
    const soundRef = useRef(null);
    const [currentLevel, setCurrentLevel] = useState(1);
    const scrollRef = useRef(null);

    const currentNode = levels.find((lvl) => lvl.id === currentLevel);

    const avatarX = useRef(new Animated.Value(currentNode.x + 15)).current;
    const avatarY = useRef(new Animated.Value(currentNode.y - 50)).current;

    const [progress, setProgress] = useState([]);

    const [stats, setStats] = useState({
        Attempted: 0,
        Correct: 0,
        points: 0,
    })

    const hearts = progress.filter(p => p.Attempted > 0).length;

    const fetchProgress = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            const res = await fetch(`${API_BASE_URL}/student/progress/topics`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                console.log(data);
                return;
            }

            setProgress(data);
        } catch (err){
            console.log(err);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchProgress();
        }, [])
    );

    const getProgressByTopic = (topicName) => {
        return progress.find(p => p.topic === topicName);
    }

    // Helper function for resuming question per topic
    const getResumeIndex = (topicId) => {
        const topic = levels.find(l => l.id === topicId);
        const p = progress.find(p => p.topic === topic?.title);

        if (!p) return 0;
        return p.Attempted || 0;
    }

    const getStartingLevel = (progressData) => {
        if (!progressData || progressData.length === 0) return 1;

        // Find the most recently attempted topic
        const mostRecent = progressData.reduce((max, item) => {
            return item.Attempted > (max?.Attempted || 0) ? item : max;
        }, null);

        if (!mostRecent) return 1;

        const level = levels.find(l => l.title === mostRecent.topic);

        return level ? level.id : 1;
    }

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

    useEffect(() => {
        if (progress.length > 0) {

            // Calculate the stats
            let totalAttempted = 0;
            let totalCorrect = 0;

            progress.forEach(p => {
                totalAttempted += p.Attempted;
                totalCorrect += p.Correct;
            });

            setStats({
                Attempted: totalAttempted,
                Correct: totalCorrect,
                points: totalCorrect * 10,
            });
        }
    }, [progress]);

    const completeLevel = () => {
        if (currentLevel < levels.length) {
            setCurrentLevel(currentLevel + 1);
        }
    };

    // This function is for playing sound in the background
    const playBackgroundMusic = async () => {
        try {
            const soundSetting = await AsyncStorage.getItem("soundEnabled");
            const isEnabled = soundSetting ? JSON.parse(soundSetting) : false;

            if (!isEnabled) return;

            const { sound } = await Audio.Sound.createAsync(
                require("../assets/images/audios/activityMap_audio.mp3"),
                {
                    shouldPlay: true,
                    isLooping: true,
                    volume: 0.9,
                }
            );
            soundRef.current = sound;
        } catch (error) {
            console.log("Error playing sound:", error);
        }
    };

    // Start and stop music
    useFocusEffect(
        useCallback(() => {
            playBackgroundMusic();

            return () => {
                if (soundRef.current) {
                    soundRef.current.stopAsync();
                    soundRef.current.unloadAsync();
                    soundRef.current = null;
                }
            };
        }, [])
    );

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
                        {levels.map((level) => {

                            const levelProgress = progress.find(
                                p => p.topic === level.title
                            );
                            return (
                                <TouchableOpacity
                                    key={level.id}
                                    style={[styles.levelNode, {left: level.x, top: level.y, backgroundColor: level.color,
                                        opacity: 1,
                                        borderColor: level.id === currentLevel ? "#FFD700" : "#ffffff",
                                        borderWidth: level.id === currentLevel ? 5 : 3,
                                    },
                                ]}
                                onPress={() => {
                                    router.push({
                                        pathname: "/Questions/questions",
                                        params: { 
                                            topicId: level.id,
                                            resumeIndex: getResumeIndex(level.id)
                                        }
                                    });
                                }}
                                >
                                    <Text style={styles.levelEmoji}>
                                        ⭐
                                    </Text>
                                    <Text style={styles.levelText}>{level.title}</Text>

                                    {levelProgress && (
                                        <Text style={{ fontSize: 10, color: "#fff", fontWeight: "bold" }}>
                                            {levelProgress.Accuracy}%
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            );
                        })}

                        {/* Avatar Marker */}
                        <Animated.View
                            style={[styles.avatarContainer, {left: avatarX, top: avatarY, }, 

                            ]}
                        >
                            <Image
                                source={require("../assets/images/logo.png")}
                                style={styles.avatar}
                            />
                        </Animated.View>
                    </ImageBackground>
            </ScrollView>

            <SafeAreaView pointerEvents='box-none' style={styles.topOverlay}>
                <View style={styles.topBar}>
                    {/* I need to change these to icons, later */}
                    <Text style={styles.stat}>⚙️ {stats.Attempted}</Text>
                    <Text style={styles.stat}>🔥 {stats.Correct}</Text>
                    <Text style={styles.stat}>💎 {stats.points}</Text>
                    <Text style={styles.stat}>❤️ {hearts}</Text>
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

                        <TouchableOpacity onPress={() => router.push("/tabs/profileSettings")}>
                            <Image 
                                source={require("../assets/images/logo.png")}
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
        width: 90,
        height: 90,
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