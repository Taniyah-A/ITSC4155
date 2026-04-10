import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ImageBackground, Dimensions, Image} from "react-native";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

// This activity is thematically consistent with activity 1. This aims to practice instant recognition for 4 year olds. 
// Subitizing is the ability to look at a small group of objects and know how many there are without counting them one by one.
// The Gameplay idea: Flash a number of stars on the screen for 2 seconds, then ask the child to pick the number that matches what they saw.

// Rounds for subitizing
const rounds = [
    {id: 1, correctAnswer: 2, 
        choices: [1, 2, 3], 
        pattern: [
            { x: 60, y: 50}, 
            {x: 250, y: 50},
        ],
    },
    {id: 2, correctAnswer: 3,
        choices: [2, 3, 4],
        pattern: [
            {x: 60, y: 50},
            {x: 250, y: 50},
            {x: 160, y: 200},
        ],
     },
    {id: 3, correctAnswer: 4,
        choices: [2, 3, 4],
        pattern: [
            {x: 60, y: 50},
            {x: 250, y: 50},
            {x: 60, y: 200},
            {x: 250, y: 200}
        ]
    },
    {id: 4, correctAnswer: 5,
        choices: [5, 6, 7],
        pattern: [
            {x: 60, y: 50},
            {x: 250, y: 50},
            {x: 60, y: 200},
            {x: 250, y: 200},
            {x: 160, y: 125},
        ]
    },
];

export default function SubitizingScreen() {
    const [roundIndex, setRoundIndex] = useState(0);
    // set phases: show, answer, correct, and wrong.
    const[phase, setPhase] = useState("show");
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const currentRound = rounds[roundIndex];

    useEffect(() => {
        startRound();
    }, [roundIndex]);

    // This function resets and begins a round.
    const startRound = () => {
        // When the round starts, show the stars.
        setPhase("show");
        setSelectedAnswer(null);

        // After 2 seconds, the stars disappear and the answer function.
        setTimeout(() => {
            setPhase("answer");
        }, 2000);
    };

    // This function runs when the child taps one of the number buttons.
    const handleAnswer = (choice) => {
        setSelectedAnswer(choice);

        if (choice === currentRound.correctAnswer) {
            setPhase("correct");
        } else {
            setPhase("wrong");
        }
    };

    const nextRound = () => {
        if (roundIndex < rounds.length - 1){
            setRoundIndex((prev) => prev + 1);
        } else {
            router.back();
        }
    };

    const tryAgain = () => {
        startRound();
    };

    return (
        <ImageBackground
             source={require("../../assets/images/nightSky.png")} 
             style={styles.background}
             resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
                {/* Title */}
                <View style={styles.topSection}>
                    <Text style={styles.title}>Title</Text>

                    {phase === "show" && (
                        <Text style={styles.instruction}>Look carefully!</Text>
                    )}

                    {phase === "answer" && (
                        <Text style={styles.instruction}>How many stars do you see?</Text>
                    )}

                    {phase === "correct" && (
                        <Text style={styles.instruction}>You did it!</Text>
                    )}

                    {phase === "wrong" && (
                        <Text style={styles.instruction}>Try again!</Text>
                    )}
                </View>
                
                <View style={styles.playArea}>
                    {(phase === "show" || phase === "wrong") && currentRound.pattern.map((stars, index) => (
                        <View
                            key={index}
                            style={[
                                styles.starBubble,
                                {left: stars.x, top: stars.y},
                            ]}
                        >
                            <Image
                                source={require("../../assets/images/star.png")}
                                style={styles.starImage}
                            />
                        </View>
                    ))}
                </View>

                {/* Answer Buttons */}
                {phase === "answer" && (
                    <View style={styles.answerSection}>
                        {currentRound.choices.map((choice) => (
                            <TouchableOpacity
                                key={choice}
                                style={styles.answerButton}
                                onPress={() => handleAnswer(choice)}
                            >
                                <Text style={styles.answerText}>{choice}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Correct Feedback */}
                {phase === "correct" && (
                    <View style={styles.feedbackBox}>
                        <Text style={styles.feedbackText}>
                            You spotted {currentRound.correctAnswer} stars!
                        </Text>

                        <TouchableOpacity style={styles.nextButton}onPress={nextRound}>
                            <Text style={styles.nextButtonText}>
                                {roundIndex === rounds.length - 1 ? "Back to Map" : "Next"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Wrong Feedback */}
                {phase === "wrong" && (
                    <View style={styles.feedbackBox}>
                        <Text style={styles.feedbackText}>
                            Let's look one more time!
                        </Text>

                        <TouchableOpacity style={styles.retryButton} onPress={tryAgain}>
                            <Text style={styles.retryButtonText}>Show Again</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1, 
        width: "100%", 
        height: "100%",
    },

    container: {
        flex: 1,
    },

    topSection: {
        alignItems: "center",
        paddingTop: 40,
        paddingHorizontal: 20,
        zIndex: 10,
    }, 

    title : {
        fontSize: 32,
        fontWeight: "900",
        color: "#FFFDF8",
        textShadowColor: "rbga(0,0,0,0.25)",
        textShadowOffset: { width: 1, height: 2},
        textShadowRadius: 4,
        marginBottom: 10,
    },

    instruction: {
        fontSize: 24, 
        fontWeight: "800",
        color: "#FFD45A",
        textAlign: "center",
        marginBottom: 10,
    },

    playArea: {
        flex: 1,
        position: "relative",
    },

    starBubble: {
        position: "absolute",
        width: 85,
        height: 85,
        borderRadius: 42.5,
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.18)",
        borderWidth: 3,
        borderColor: "#FFF6C9"
    },

    starImage: {
        width: 55, 
        height: 55,
        resizeMode: "contain",
    },

    answerSection : {
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingHorizontal: 20,
        marginBottom: 70,
    },

    answerButton: {
        width: 85,
        height: 85,
        borderRadius: 42.5,
        backgroundColor: "#eee8d8",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 5,
    },

    answerText: {
        fontSize: 24,
        fontWeight: "900",
        color: "#355C9A",
    },

    feedbackBox: {
        alignItems: "center",
        marginBottom: 70,
        paddingHorizontal: 20,
    },

    feedbackText: {
        fontSize: 24,
        fontWeight: "800",
        color: "#FFFDF8",
        textAlign: "center",
        marginBottom: 20,
    },

    nextButton: {
        backgroundColor: "#57C7FF",
        paddingHorizontal: 28,
        paddingVerical: 14,
        borderRadius: 24,
    },

    nextButtonText: {
        color: "#FFF",
        fontSize: 20,
        fontWeight: "900",
    },

    retryButton: {
        backgroundColor: "#FECB4F",
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 24,
    },

    retryButtonText: {
        color: "#FFF",
        fontSize: 20,
        fontWeight: "900",
    },
});