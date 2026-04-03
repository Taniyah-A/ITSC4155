import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack 
      screenOptions = {{
        headerStyle: {
          backgroundColor: "#E6F4FE",
        },
        headerTintColor: "blue",
      }}>
        <Stack.Screen name="index" options={{ title: "Achievements" }} />
        <Stack.Screen name="badgeEarned" options={{ title: "Badge Earned" }} />
    </Stack>
);
}

export default RootLayout;