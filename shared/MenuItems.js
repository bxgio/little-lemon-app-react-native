import {Alert, View, StyleSheet, Text, FlatList, Image} from "react-native";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {filterByQueryAndCategories} from "../database";
import {getCategoriesListData, useUpdateEffect} from "../utils";
import Filters from "./Filters";
import debounce from 'lodash.debounce';
import {Searchbar} from "react-native-paper";
import HeroSection from "./HeroSection";
import useMenuItems from "./getMenuItems";
import Item from './MenuItem';
//FILTERS
const categories = ['starters', 'mains', 'desserts'];

function MenuItems() {
    const [data, setData] = useState([]);
    const [searchBarText, setSearchBarText] = useState('');
    const [query, setQuery] = useState('');
    const { menuItems, error } = useMenuItems();
    const [filterSelections, setFilterSelections] = useState(
        categories.map(() => false)
    );

    useEffect(() => {
        if (menuItems) {
            const categoriesListData = getCategoriesListData(menuItems);
            setData(categoriesListData);
        }
    }, [menuItems]);

    useUpdateEffect(() => {
        (async () => {
            const activeCategories = categories.filter((s, i) => {
                // If all filters are deselected, all categories are active
                if (filterSelections.every((item) => item === false)) {
                    return true;
                }
                return filterSelections[i];
            });
            try {
                const menuItems = await filterByQueryAndCategories(query, activeCategories);
                const sectionListData = getCategoriesListData(menuItems);
                setData(sectionListData);
            } catch (e) {
                Alert.alert(e.message);
            }
        })();
    }, [filterSelections, query]);

    const lookup = useCallback((q) => {
        setQuery(q);
    }, []);

    const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

    const handleSearchChange = (text) => {
        setSearchBarText(text);
        debouncedLookup(text);
    };

    const handleFiltersChange = async (index) => {
        const arrayCopy = [...filterSelections];
        arrayCopy[index] = !filterSelections[index];
        setFilterSelections(arrayCopy);
    };
    console.log('Data:', data);
    if (error) {
        // handle the error case
        return (
            <View>
                <Text>Error: {error}</Text>
            </View>
        );
    }

return (
    <View style={styles.container}>
        <Searchbar
            placeholder="Search"
            placeholderTextColor="white"
            onChangeText={handleSearchChange}
            value={searchBarText}
            style={styles.searchBar}
            iconColor="white"
            inputStyle={{ color: 'white' }}
            mode={"view"}
        />
        <Filters
            selections={filterSelections}
            onChange={handleFiltersChange}
            sections={categories}
        />
        <FlatList
            style={styles.sectionList}
            data={data.flatMap((section) => section.data)}
            keyExtractor={(item) => item.uuid}
            renderItem={({ item }) => <Item item={item} />}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
    </View>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    sectionList: {
        paddingHorizontal: 16,
    },
    searchBar: {
        backgroundColor: '#495E57',
    },
    separator: {
        height: 1,
        backgroundColor: 'gray',
    },
});

export default MenuItems;