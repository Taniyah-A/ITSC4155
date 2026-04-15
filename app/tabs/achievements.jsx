import { useRouter } from "expo-router";
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2;

const GAMIFIED_ACHIEVEMENTS = [
  {
    id: "1",
    title: "Novice Reward",
    level: "Beginner",
    unlocked: true,
    image: require("../../assets/images/badges/badge1.png"),
  },
  {
    id: "2",
    title: "Level1 Star",
    level: "Beginner",
    unlocked: true,
    image: require("../../assets/images/badges/badge2.png"),
  },
  {
    id: "3",
    title: "Contributer",
    level: "Medium",
    unlocked: true,
    image: require("../../assets/images/badges/badge3.png"),
  },
  {
    id: "4",
    title: "Math Wizard",
    level: "Expert",
    unlocked: true,
    image: require("../../assets/images/badges/badge4.png"),
  },
  {
    id: "5",
    title: "Counting Star",
    level: "Medium",
    unlocked: true,
    image: require("../../assets/images/badges/badge5.png"),
  },
  {
    id: "6",
    title: "Streak Master",
    level: "Expert",
    unlocked: false,
    image: require("../../assets/images/badges/badge6.png"),
  },
  {
    id: "7",
    title: "Lucky 7",
    level: "Medium",
    unlocked: true,
    image: require("../../assets/images/badges/badge7.png"),
  },
  {
    id: "8",
    title: "Master of Numbers",
    level: "Expert",
    unlocked: false,
    image: require("../../assets/images/badges/badge8.png"),
  },
  {
    id: "9",
    title: "Level10 Star",
    level: "Expert",
    unlocked: false,
    image: require("../../assets/images/badges/badge9.png"),
  },
];

export default function AchievementsDashboard() {
  const router = useRouter();

  const renderAchievementCard = ({ item }) => {
    const cardBgColor = item.unlocked ? "#ffeddd" : "#e49e11";
    const labelColor = item.unlocked ? "#555" : "#654d09";
    const ribbonColor = item.unlocked ? "#67FEFF" : "#444";
    const ribbonText = item.unlocked ? "#555" : "#666";

    return (
      <View style={[styles.card, { backgroundColor: cardBgColor }]}>
        <Text style={[styles.cardTitle, { color: labelColor }]}>
          {item.title}
        </Text>

        <View style={styles.badgeWrapper}>
          <Image
            source={item.image}
            style={[
              styles.badgeImage,
              !item.unlocked && { opacity: 0.2, tintColor: "black" },
            ]}
            resizeMode="contain"
          />
          {item.unlocked && (
            <View style={[styles.ribbon, { backgroundColor: ribbonColor }]}>
              <Text style={[styles.ribbonText, { color: ribbonText }]}>
                {item.level}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Achievements</Text>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.profileBadgeMini}
        />
      </View>

      {/* Grid of 2xCards */}
      <View style={styles.content}>
        <FlatList
          data={GAMIFIED_ACHIEVEMENTS}
          renderItem={renderAchievementCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <SafeAreaView pointerEvents="box-none" style={styles.bottomOverlay}>
        <View style={styles.bottomNav}>
          <TouchableOpacity onPress={() => router.push("/ActivityMap")}>
            <Image
              source={require("../../assets/images/home.png")}
              style={styles.navImage}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/tabs/achievements")}>
            <Image
              source={require("../../assets/images/achievement.png")}
              style={styles.navImage}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/tabs/stats")}>
            <Image
              source={require("../../assets/images/stats.png")}
              style={styles.navImage}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/tabs/profileSettings")}
          >
            <Image
              source={require("../../assets/images/avatar.jpeg")}
              style={styles.navImageAvatar}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

// 5. Stylistic Deep Dive
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf7f2", // Deep dark theme background
  },
  // Header Styles
  header: {
    backgroundColor: "#f5a623", // Orange background
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    position: "relative",
    overflow: "hidden",
  },
  headerTitle: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#ffffff",
    alignItems: "center",
    marginBottom: 30,
  },
  profileBadgeMini: {
    width: 45,
    height: 45,
    alignItems: "right",
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: "#ffffff",
    backgroundColor: "#fdca53",
    position: "absolute",
    bottom: 75,
    right: 20,
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  content: {
    flex: 1,
    marginTop: -30, // overlap effect
    backgroundColor: "#fdf7f2",
    paddingVertical: 16.8,
    borderRadius: 20,
    marginBottom: 12,
  },
  // Grid/Card Styles
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  gridRow: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    width: CARD_WIDTH,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  badgeWrapper: {
    position: "relative", // Necessary for ribbon positioning
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  badgeImage: {
    width: 100,
    height: 100,
  },
  ribbon: {
    position: "absolute",
    bottom: -15, // Negative offset to position *under* the badge like image 3
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 15,
  },
  ribbonText: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  // Progress Bar Styles
  progressContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 15,
  },
  statusText: {
    fontSize: 12,
    marginTop: 10,
  },
  barBackground: {
    width: "100%",
    height: 6,
    backgroundColor: "#111",
    borderRadius: 3,
    overflow: "hidden",
  },
  barLabelWrapper: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 6,
  },
  nextText: {
    fontSize: 10,
    color: "#666",
  },
  percentText: {
    fontSize: 10,
    color: "#FFF",
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
    marginBottom: 12, // Lifts the bar off the bottom edge
    backgroundColor: "#FFFDF8",
    borderRadius: 32,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  navImage: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  navImageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#23f5ee", // color to show it's "Active"
  },
  navIcon: {
    fontSize: 24,
    color: "#B8BCC7",
  },
});
