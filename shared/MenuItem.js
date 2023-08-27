import React from 'react';
import {View, Text, StyleSheet, Image} from "react-native";

const API_BASE_URL = 'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/';

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    details: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
        color: 'black',
    },
    description: {
        fontSize: 14,
        marginBottom: 4,
        color: '#495E57',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#495E57',
    },
    image: {
        width: 80,
        height: 80,
        marginRight: 16,
    },
});

const Item = ({ item }) => {
    return (
        <View style={styles.item}>
            <View style={styles.details}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.description}>
                    {item.description && item.description.length > 40
                        ? item.description.substring(0, 40) + '...'
                        : item.description}
                </Text>
                <Text style={styles.price}>${item.price}</Text>
            </View>
            <Image
                style={styles.image}
                source={{ uri: `${API_BASE_URL}${item.image}?raw=true` }}
            />
        </View>
    );
};

export default Item;