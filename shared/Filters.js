import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
/*
 * @author Fernando Presa
 * @date 31 May 2023
 */
const Filters = ({ onChange, selections, sections }) => {
    return (
        <View style={styles.filtersContainer}>
            {sections.map((section, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => {
                        onChange(index);
                    }}
                    style={{
                        flex: 1 / sections.length,
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 16,
                        backgroundColor: selections[index] ? '#EE9972' : '#495E57',
                        borderWidth: 1,
                        borderColor: 'white',
                    }}>
                    <View>
                        <Text style={{ color: selections[index] ? 'black' : 'white' }}>
                            {section}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    filtersContainer: {
        backgroundColor: 'green',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
});

export default Filters;