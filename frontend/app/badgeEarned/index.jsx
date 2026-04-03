import { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from "react-native";

const BadgeEarned = () => {
    const [badges, setBadges] = useState([
        { id: '1', text : 'First Badge' },
        { id: '2', text : 'Second Badge'},
        { id: '3', text : 'Third Badge '},
    ]);

    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.container}>
            <FlatList
            data={badges}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.badgeItem}>
                    <Text style={styles.badgeText}>{item.text}</Text>
                </View>
            )}
            />

            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                <Text styles={styles.buttonText}>Badge desc</Text>
            </TouchableOpacity>

            {/*modal*/}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>

                </View>
            </Modal>
        </View> 
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "peachpuff",
    },
    button: {
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
        backgroundColor: "lightblue",
    },
    buttonText: {
        color: "purple",
        fontSize: 16,
        fontWeight: "bold",
    }
});

export default BadgeEarned;