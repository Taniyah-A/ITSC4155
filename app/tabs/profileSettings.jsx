import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const ProfilePage = () => {
  // States for the toggle switches
  const router = useRouter();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  // Reusable component for the menu rows
  const MenuRow = ({ label, hasSwitch, value, onValueChange, onPress }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      disabled={hasSwitch}
    >
      <Text style={styles.menuLabel}>{label}</Text>
      {hasSwitch ? (
        <Switch
          trackColor={{ false: "#767577", true: "#f5a623" }}
          thumbColor={"#fff"}
          onValueChange={onValueChange}
          value={value}
        />
      ) : (
        <Text style={styles.arrow}>❯</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView bounces={false}>
        {/* Header Section (The Orange Part) */}
        <View style={styles.header}>
          <Image
            source={require("../../assets/images/logo.png")} // Replace with your path
            style={styles.avatar}
          />
          <Image
            source={require("../../assets/images/animals_right.png")}
            style={styles.rightAnimals}
          />
          <Image
            source={require("../../assets/images/animals_left.png")}
            style={styles.leftAnimals}
          />
          <Text style={styles.userName}>Jane Cooper</Text>
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>3520 ⭐</Text>
          </View>

        </View>

        {/* Content Section (The White Part) */}
        <View style={styles.content}>
          <MenuRow label="Profile" onPress={() => {}} />
          <MenuRow 
            label="Achievements" 
            onPress={() => {
              router.replace("/tabs/achievements");
            }}
          />

          <MenuRow
            label="Notifications"
            hasSwitch
            value={isNotificationsEnabled}
            onValueChange={setIsNotificationsEnabled}
          />

          <MenuRow
            label="Music"
            hasSwitch
            value={isMusicEnabled}
            onValueChange={setIsMusicEnabled}
          />

          <MenuRow
            label="Sound"
            hasSwitch
            value={isSoundEnabled}
            onValueChange={setIsSoundEnabled}
          />

          <MenuRow label="More" onPress={() => {}} />
          <MenuRow
            label="Log out"
            onPress={() => {
              router.replace("/");
            }}
          />
        </View>
      </ScrollView>

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

          <TouchableOpacity onPress={() => router.push("/tabs/profileSettings")}>
            <Image
              source={require("../../assets/images/avatar.jpeg")}
              style={styles.navImageAvatar}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffbf7", // Light cream background
  },
  header: {
    backgroundColor: "#f5a623", // Orange background
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    position: "relative",
    overflow: "hidden",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#fdca53",
  },
  leftAnimals: {
    position: "absolute",
    bottom: 0,
    left: -90,
    width: 290,
    height: 328,
    resizeMode: "contain",
  },

  rightAnimals: {
    position: "absolute",
    bottom: 0,
    right: -90,
    width: 290,
    height: 328,
    resizeMode: "contain",
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginTop: 10,
  },
  pointsBadge: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 10,
  },
  pointsText: {
    fontWeight: "bold",
    color: "#555",
  },
  content: {
    flex: 1,
    marginTop: -30, // Creates the overlap effect
    backgroundColor: "#fdf7f2",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffeddd", // Slightly darker than background
    paddingVertical: 16.8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 12,
    // Add subtle shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    // Add elevation for Android
    elevation: 2,
  },
  menuLabel: {
    fontSize: 16,
    color: "#555",
    fontWeight: "500",
  },
  arrow: {
    color: "#555",
    fontSize: 18,
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

export default ProfilePage;