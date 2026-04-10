import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  Image,
} from "react-native";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

// Each round = how many stars the child should count, 4 rounds but we can add more
const rounds = [
  { id: 1, target: 3 },
  { id: 2, target: 4 },
  { id: 3, target: 2 },
  { id: 4, target: 5 },
];

// Fixed star positions so they don't overlap, still needs work so its not on the grass.
const starLayouts = {
  2: [
    { x: 60, y: 180 },
    { x: 220, y: 40 },
  ],
  3: [
    { x: 50, y: 30},
    { x: 220, y: 30},
    { x: 130, y: 150},
  ],
  4: [
    { x: 50, y: 20},
    { x: 230, y: 20 },
    { x: 80, y: 200},
    { x: 220, y: 170 },
  ],
  5: [
    { x: 45, y: 25},
    { x: 220, y: 20},
    { x: 120, y: 150},
    { x: 50, y: 270 },
    { x: 300, y: 160 },
  ],
};

export default function OneToOneScreen() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [stars, setStars] = useState([]);

  const currentRound = rounds[roundIndex];
  const target = currentRound.target;

  // Load stars for each round
  useEffect(() => {
    const layout = starLayouts[target];
    const newStars = layout.map((pos, i) => ({
      id: i,
      tapped: false,
      x: pos.x,
      y: pos.y,
    }));
    setStars(newStars);
    setCount(0);
  }, [roundIndex]);

  const handleStarTap = (id) => {
    const tappedStar = stars.find((star) => star.id === id);
    if (!tappedStar || tappedStar.tapped) return;

    const updatedStars = stars.map((star) =>
      star.id === id ? { ...star, tapped: true } : star
    );

    setStars(updatedStars);
    setCount((prev) => prev + 1);
  };

  const roundComplete = count === target;

  const nextRound = () => {
    if (roundIndex < rounds.length - 1) {
      setRoundIndex((prev) => prev + 1);
    } else {
      // Finished the whole activity
      router.back(); // goes back to the map for now, may add more activities.
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/nightSky.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* Top Section */}
        <View style={styles.topSection}>
          <Text style={styles.title}>Count the Stars</Text>
          <Text style={styles.instruction}>Tap {target} stars!</Text>

          <View style={styles.counterBubble}>
            <Text style={styles.counterText}>
              {count} / {target}
            </Text>
          </View>
        </View>

        {/* Star Play Area */}
        <View style={styles.playArea}>
          {stars.map((star) => (
            <TouchableOpacity
              key={star.id}
              style={[
                styles.starButton,
                {
                  left: star.x,
                  top: star.y,
                  opacity: star.tapped ? 0.25 : 1,
                },
              ]}
              onPress={() => handleStarTap(star.id)}
              disabled={star.tapped}
            >
              <Image 
                source={require("../../assets/images/star.png")}
                style={styles.starImage}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Success Box */}
        {roundComplete && (
          <View style={styles.successOverlay}>
            <View style={styles.successCard}>
              <Text style={styles.successTitle}>✨ Great Job! ✨</Text>
              <Text style={styles.successSubtitle}>
                You counted {target} stars!
              </Text>

              <TouchableOpacity style={styles.nextButton} onPress={nextRound}>
                <Text style={styles.nextButtonText}>
                  {roundIndex === rounds.length - 1 ? "Back to Map" : "Next"}
                </Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: 30,
    paddingHorizontal: 20,
    zIndex: 10,
  },

  title: {
    fontSize: 40,
    fontWeight: "900",
    color: "#FFFDF8",
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },

  instruction: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFD45A",
    marginBottom: 16,
  },

  counterBubble: {
    backgroundColor: "rgba(255, 253, 248, 0.95)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },

  counterText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#355C9A",
  },

  playArea: {
    flex: 1,
    position: "relative",
  },

  starButton: {
    position: "absolute",
    width: 85,
    height: 85,
    borderRadius: 42.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 3,
    borderColor: "#FFF6C9",
  },

  starImage: {
    width: 55,
    height: 55,
    resizeMode: "contain",
  },

  successOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(18, 31, 61, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  successCard: {
    width: width - 48,
    backgroundColor: "#FFFDF8",
    borderRadius: 28,
    paddingVertical: 30,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 10,
  },

  successTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: "#6DB44A",
    marginBottom: 10,
  },

  successSubtitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6E7280",
    marginBottom: 24,
    textAlign: "center",
  },

  nextButton: {
    backgroundColor: "#57C7FF",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 24,
  },

  nextButtonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "900",
  },
});