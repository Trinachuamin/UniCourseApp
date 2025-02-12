import React, { useEffect, useState } from 'react';
import {
    View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Sorting dropdown
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [sound, setSound] = useState();
    const [favorites, setFavorites] = useState([]);
    const [sortOption, setSortOption] = useState("None");

    // Fetch data from API
    useEffect(() => {
        fetch('https://data.gov.sg/api/action/datastore_search?resource_id=d_6b264092cd066c55d8e2db9e68e7ffdb')
            .then(response => response.json())
            .then(json => setData(json.result.records))
            .catch(error => console.error(error));
    }, []);

    // Load Favorites from AsyncStorage
    useEffect(() => {
        const loadFavorites = async () => {
            const savedFavorites = JSON.parse(await AsyncStorage.getItem('favorites')) || [];
            setFavorites(savedFavorites);
        };
        loadFavorites();
    }, []);

    // Function to play sound
    async function playSound() {
        try {
            if (sound) await sound.unloadAsync();
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, shouldDuckAndroid: false });
            const { sound: newSound } = await Audio.Sound.createAsync(require('./click.mp3'));
            setSound(newSound);
            await newSound.setVolumeAsync(1.0);
            await newSound.playAsync();
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }

    useEffect(() => {
        return sound ? () => sound.unloadAsync() : undefined;
    }, [sound]);

    // Toggle Favorite Courses
    const toggleFavorite = async (course) => {
        const isFavorite = favorites.some(item => item._id === course._id);
        let updatedFavorites = isFavorite
            ? favorites.filter(item => item._id !== course._id)
            : [...favorites, course];

        setFavorites(updatedFavorites);
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    // Filter data based on search input
    const filteredData = data.filter(item =>
        item.course.toLowerCase().includes(search.toLowerCase()) ||
        item.year.includes(search) ||
        item.sex.toLowerCase().includes(search.toLowerCase())
    );

    // Sorting logic (Improved)
    const sortedData = [...filteredData].sort((a, b) => {
        if (sortOption === "Graduates") return b.graduates - a.graduates;
        if (sortOption === "Intake") return b.intake - a.intake;
        if (sortOption === "Course A-Z") return a.course.localeCompare(b.course);
        if (sortOption === "Course Z-A") return b.course.localeCompare(a.course);
        if (sortOption === "Year (Newest)") return b.year - a.year;
        if (sortOption === "Year (Oldest)") return a.year - b.year;
        if (sortOption === "Enrollment (High-Low)") return b.enrolment - a.enrolment;
        if (sortOption === "Enrollment (Low-High)") return a.enrolment - b.enrolment;
        return 0;
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📊 University Data</Text>

            {/* Search Bar */}
            <TextInput
                style={styles.searchBox}
                placeholder="🔍 Search by Year, Course, or Gender..."
                value={search}
                onChangeText={setSearch}
            />

            {/* Sorting Dropdown */}
            <Picker
                selectedValue={sortOption}
                style={styles.picker}
                onValueChange={(itemValue) => setSortOption(itemValue)}
            >
                <Picker.Item label="Sort by: None" value="None" />
                <Picker.Item label="Sort by: Course A-Z" value="Course A-Z" />
                <Picker.Item label="Sort by: Course Z-A" value="Course Z-A" />
                <Picker.Item label="Sort by: Year (Newest)" value="Year (Newest)" />
                <Picker.Item label="Sort by: Year (Oldest)" value="Year (Oldest)" />
                <Picker.Item label="Sort by: Enrollment (High-Low)" value="Enrollment (High-Low)" />
                <Picker.Item label="Sort by: Enrollment (Low-High)" value="Enrollment (Low-High)" />
            </Picker>

            {/* Button to View Favorites */}
            <TouchableOpacity style={styles.favButton} onPress={() => navigation.navigate('Favorites')}>
                <Text style={styles.favButtonText}>View Favorites</Text>
            </TouchableOpacity>

            {/* Course List */}
            <FlatList
                data={sortedData}
                keyExtractor={item => item._id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => {
                            playSound();
                            navigation.navigate('Details', { record: item });
                        }}
                    >
                        <Text style={styles.cardTitle}>📚 {item.course}</Text>
                        <Text style={styles.cardSubtitle}>📅 Year: {item.year}</Text>
                        <Text style={styles.cardSubtitle}>👥 Gender: {item.sex}</Text>

                        <TouchableOpacity onPress={() => toggleFavorite(item)} style={styles.favIcon}>
                            <Text style={styles.favIconText}>
                                {favorites.some(fav => fav._id === item._id) ? "❤️" : "🤍"}
                            </Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F4F4",
        padding: 16
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#005A9C",
        textAlign: "center",
        marginBottom: 12
    },
    searchBox: {
        backgroundColor: "#FFF",
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#005A9C",
        fontSize: 16,
        marginBottom: 12
    },
    picker: {
        height: 50,
        width: "100%",
        backgroundColor: "#FFF",
        marginBottom: 10,
        borderRadius: 5
    },
    favButton: {
        backgroundColor: "#FFD700",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10
    },
    favButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333"
    },
    card: {
        backgroundColor: "#FFF",
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#005A9C"
    },
    cardSubtitle: {
        fontSize: 14,
        color: "#666",
        marginTop: 4
    },
    favIcon: {
        padding: 10,
        marginTop: 8,
        alignSelf: "flex-end",
    },
    favIconText: {
        fontSize: 18,
    },

});

export default HomeScreen;
