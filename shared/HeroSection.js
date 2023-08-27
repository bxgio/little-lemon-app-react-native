import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';

function HeroSection() {
    return (
        <View style={styles.container}>
            <Text style={styles.title} variant="displayLarge">
                Little Lemon
            </Text>
            <View style={styles.contentContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.subTitle} variant="headlineMedium">
                        Chicago
                    </Text>
                    <Text style={styles.text} variant="bodyLarge">
                        We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
                    </Text>
                </View>
                <Image source={require('../assets/Hero_image.png')} style={styles.image} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#495E57',
        padding: 10,
    },
    contentContainer: {
        flexDirection: 'row',
    },
    textContainer: {
        flex: 1,
        marginRight: 20,
    },
    image: {
        width: 115,
        height: 115,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: '#000000',
    },
    title: {
        fontWeight: 'bold',
        textAlign: 'left',
        color: '#F4CE14',
    },
    subTitle: {
        fontWeight: 'bold',
        textAlign: 'left',
        color: 'rgba(255,255,255,0.88)',
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5,
    },
    text: {
        textAlign: 'left',
        color: 'rgba(255,255,255,0.88)',
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5,
        marginTop: 10,
    },
});

export default HeroSection;