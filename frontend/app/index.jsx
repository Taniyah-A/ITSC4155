import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import Badge1 from '@/assets/images/badge.png';
import {useRouter} from 'expo-router';

const Achievements = () => {
  const router = useRouter();

  return (
    <View style= {styles.container}>
      <Image source={Badge1} style={styles.image} />
      <Text></Text>
      <TouchableOpacity
        sytle="styles.button"
        onPress={() => router.push('/badgeEarned')}
      >
        <Text style={styles.button}>Badge here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
  },
  button: {
    color: "purple",
  }
});

export default Achievements;
