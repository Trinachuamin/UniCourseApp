import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DetailScreen = ({ route, navigation }) => {
    const { record } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>📊 {record.course}</Text>
            <Text style={styles.text}>📅 Year: {record.year}</Text>
            <Text style={styles.text}>👥 Gender: {record.sex}</Text>
            <Text style={styles.text}>📥 Intake: {record.intake}</Text>
            <Text style={styles.text}>📖 Enrollment: {record.enrolment}</Text>
            <Text style={styles.text}>🎓 Graduates: {record.graduates}</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        padding: 16,
        alignItems: "center",
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#005A9C",
        marginBottom: 10,
    },
    text: {
        fontSize: 18,
        color: "#333",
        marginTop: 5,
    },
    button: {
        backgroundColor: "#005A9C",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
        width: "80%",
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default DetailScreen;
