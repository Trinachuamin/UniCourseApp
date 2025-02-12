import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import DetailScreen from './DetailScreen';
import FavoritesScreen from './FavoritesScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: "#005A9C" }, headerTintColor: "#fff" }}>
                <Stack.Screen name="University Data" component={HomeScreen} />
                <Stack.Screen name="Details" component={DetailScreen} />
                <Stack.Screen name="Favorites" component={FavoritesScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
