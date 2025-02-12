import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesScreen = ({ navigation }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const loadFavorites = async () => {
            const savedFavorites = JSON.parse(await AsyncStorage.getItem('favorites')) || [];
            setFavorites(savedFavorites);
        };
        loadFavorites();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>⭐ Favorite Courses</Text>
            <FlatList
                data={favorites}
                keyExtractor={item => item._id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('Details', { record: item })}
                    >
                        <Text style={styles.cardTitle}>📚 {item.course}</Text>
                        <Text style={styles.cardSubtitle}>📅 Year: {item.year}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#FFF" },
    title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 12 },
    card: { backgroundColor: "#EEE", padding: 12, borderRadius: 8, marginBottom: 8 },
    cardTitle: { fontSize: 18, fontWeight: "bold" },
    cardSubtitle: { fontSize: 14, color: "#555" },
});

export default FavoritesScreen;
