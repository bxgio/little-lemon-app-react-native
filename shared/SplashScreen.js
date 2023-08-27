import React from 'react';
import { View, StyleSheet } from 'react-native';

function SplashScreen() {
    return (
        <View style={styles.container}>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    image: {
        width: 200,
        height: 200,
    },
});

export default SplashScreen;