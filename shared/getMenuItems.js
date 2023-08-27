import { useState, useEffect } from 'react';
import { createTable, getMenuItems, saveMenuItems } from "../database";

const API_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';

async function fetchData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data.menu.map(item => ({
            ...item,
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default function useMenuItems() {
    const [menuItems, setMenuItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                await createTable();
                let menuItems = await getMenuItems();
                // The application only fetches the menu data once from a remote URL
                // and then stores it into a SQLite database.
                // After that, every application restart loads the menu from the database
                // If no menuItems in database, fetch them from the API
                if (!menuItems.length) {
                    menuItems = await fetchData();
                    await saveMenuItems(menuItems);
                    menuItems = await getMenuItems();
                }

                setMenuItems(menuItems);
            } catch (e) {
                setError(e.message);
            }
        })();
    }, []);

    return { menuItems, error };
}