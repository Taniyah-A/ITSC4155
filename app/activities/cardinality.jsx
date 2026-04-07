import React, { useState } from "react";
import {
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    SafeAreaView,
    ImageBackground, 
    Image,
    Touchable, 
} from "react-native";
import { router } from "expo-router";

const rounds = [
    {
        id: 1, 
        total: 3,
        choices: [2, 3, 4],
        flowers: [
            
                {id: 1, x: 55, y: 180, image: require("../../assets/images/flower1.png")},
                {id: 2, x: 155, y: 270, image: require("../../assets/images/flower2.png")},
                {id: 3, x: 255, y: 190, image: require("../../assets/images/flower3.png")},
        ],
    },
    {
        id: 2, 
        total: 5,
        choices: [3, 4, 5],
        flowers: [
                {id: 1, x: 35, y: 160, image: require("../../assets/images/flower1.png")},
                {id: 2, x: 120, y: 240, image: require("../../assets/images/flower2.png")},
                {id: 3, x: 220, y: 170, image: require("../../assets/images/flower3.png")},
                {id: 4, x: 70, y: 340, image: require("../../assets/images/flower1.png")},
                {id: 5, x: 220, y: 340, image: require("../../assets/images/flower3.png")},
        ],
    },
];

export default function CardinalityGame() {
    const [roundIndex, setRoundIndex] = useState(0);
    const [tappedFlowers, setTappedFlowers] = useState([]);
    const [count, setCount] = useState(0);

    // phases: counting, answer, correct, wrong.
    const [phase, setPhase] = useState("counting");

    const currentRound = rounds[roundIndex];

    // Flower tap logic
    const handleFlowerTap = (flowerId) => {
        if (tappedFlowers.includes(flowerId)) return;

        const newTapped = [...tappedFlowers, flowerId];
        setTappedFlowers(newTapped);
        setCount(newTapped.length);

        if (newTapped.length === currentRound.total) {
            setTimeout(() => {
                setPhase("answer");
            }, 700);
        }
    };

    // Check Answer
    const handleAnswer = (choice) => {
        if (choice === currentRound.total) {
            setPhase("correct");
        } else {
            setPhase("wrong");
        }
    };

    const nextRound = () => {
        if (roundIndex < rounds.length - 1) {
            setRoundIndex((prev) => prev + 1);
            setTappedFlowers([]);
            setCount(0);
            setPhase("counting");
        } else {
            router.back();
        }
    };

    const tryAgain = () => {
        setPhase("answer");
    };

    return (
        <ImageBackground
            source={require("../../assets/images/flowerField-bg.png")}
            style={styles.background}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.topSection}>
                    <Text style={styles.title}> Count the Flowers</Text>

                    {phase === "counting" && (
                        <Text style={styles.instruction}> Tap the flowers and count!</Text>
                    )}

                    {phase === "answer" && (
                        <Text style={styles.instruction}> How many flowers are there?</Text>
                    )}

                    {phase === "correct" && (
                        <Text style={styles.instruction}> Great counting!</Text>
                    )}

                    {phase === "wrong" && (
                        <Text style={styles.instruction}> That's not right, let's try again!</Text>
                    )}
                </View>

                {/* Count bubble*/}
                {phase === "counting" && count > 0 && (
                    <View style={styles.countBubble}>
                        <Text style={styles.countText}>{count}</Text>
                    </View>
                )}

                <View style={styles.playArea}>
                    {/* Flowers */}
                    {currentRound.flowers.map((flower) => {
                        const isTapped = tappedFlowers.includes(flower.id);

                        return (
                            <TouchableOpacity
                                key={flower.id}
                                style={[styles.flowerWrapper, { left: flower.x, top: flower.y, opacity: isTapped ? 0.35 : 1},]}
                                onPress={() => handleFlowerTap(flower.id)}
                                disabled={phase !== "counting" || isTapped}
                            >
                                <Image source={flower.image} style={styles.flowerImage} />
                            </TouchableOpacity>
                        )
                    })}
                    {/* Basket */}
                    <Image
                        source={require("../../assets/images/basket.png")}
                        style={styles.basket}
                    />
                </View>

                {/* Answer Button */}
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

                {/* Correct feedback */}
                {phase == "correct" && (
                    <View style={styles.feedbackBox}>
                        <Text style={styles.feedbackText}>
                            Yes! There are {currentRound.total} flowers!
                        </Text>

                        <TouchableOpacity style={styles.nextButton} onPress={nextRound}>
                            <Text style={styles.nextButtonText}>
                                {roundIndex === rounds.length - 1 ? "Back to Map" : "Next"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Wrong Freedback */}
                {phase === "wrong" && (
                    <View style={styles.feedbackBox}>
                        <Text style={styles.feedbackText}>
                            Let's count again!
                        </Text>
                        <TouchableOpacity style={styles.retryButton} onPress={tryAgain}>
                            <Text style={styles.retryButtonText}>Try Again</Text>
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

    title: {
        fontSize: 32,
        fontWeight: "900",
        color: "#FFFdF8",
        textShadowColor: "rgba(0,0,0,0.25)",
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 4,
        marginBottom: 10,
    },

    instruction: {
        fontSize: 24, 
        fontWeight: "800",
        color: "#FFE27A",
        textAlign: "center",
        marginBottom: 10,
    },

    countBubble: {
        alignSelf: "center",
        marginTop: 10,
        width: 95,
        height: 95,
        borderRadius: 47.5,
        backgroundColor: "rgba(255,255,255, 0.92)",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 6,
        zIndex: 10,

    },

    countText: {
        fontSize: 44,
        fontWeight: "900",
        color: "#4c7c59",
    },

    playArea: {
        flex: 1,
        position: "relative",
    },

    flowerWrapper: {
        position: "absolute",
        width: 90,
        height: 90,
        zIndex: 5,
    },

    flowerImage: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },

    basket: {
        position: "absolute",
        bottom: 40,
        alignSelf: "center",
        width: 160,
        height: 120, 
        resizeMode: "contain",
    },

    answerSection: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingHorizontal: 20,
        marginBottom: 70,
    },

    answerButton: {
        width: 85,
        height: 85,
        borderRadius: 42.5,
        backgroundColor: "#FFFDF8",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowRadius: 5, 
        elevation: 5
    },

    answerText: {
        fontSize: 34, 
        fontWeight: "900",
        color: "#4c7c59",
    },

    feedbackBox: {
        alignItems: "center",
        marginBottom: 70,
        paddingHorizontal: 20,
    },

    feedbackText: {
        fontSize: 24, 
        fontWeight: "800",
        color: "#fffdf8",
        textAlign: "center",
        marginBottom: 20,
    },

    nextButton: {
        backgroundColor: "#67c587",
        paddingHorizontal: 28,
        paddingVertical: 14,
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
        color: "#fff",
        fontSize: 20,
        fontWeight: "900",
    },
});