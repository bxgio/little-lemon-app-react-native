import * as SQLite from 'expo-sqlite';
import uuid from 'react-native-uuid';
/*
 * @author Fernando Presa
 * @date 31 May 2023
 */
const db = SQLite.openDatabase('little_lemon');

export async function createTable() {
    return new Promise((resolve, reject) => {
        db.transaction(
            (tx) => {
                tx.executeSql(
                    `create table if not exists menuitems (
                        uuid text primary key, 
                        name text, 
                        price text, 
                        category text,
                        description text,
                        image text
                    );`
                );
            },
            reject,
            resolve
        );
    });
}

export async function getMenuItems() {
    return new Promise((resolve) => {
        db.transaction((tx) => {
            tx.executeSql('select * from menuitems', [], (_, { rows }) => {
                resolve(rows._array);
            });
        });
    });
}

/*export function saveMenuItems(menuItems) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO menuitems (uuid, name, price, category, description, image) VALUES ${menuItems
                    .map((item) => `('${uuid.v4()}', '${item.name}', '${item.price}', '${item.category}', '${item.description}', '${item.image}')`)
                    .join(', ')}`
            );
        }, reject, resolve);
    });
}*/
export function saveMenuItems(menuItems) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            menuItems.forEach(item => {
                tx.executeSql(
                    `INSERT INTO menuitems (uuid, name, price, category, description, image) VALUES (?, ?, ?, ?, ?, ?)`,
                    [uuid.v4(), item.name, item.price, item.category, item.description, item.image],
                    null,
                    (_, error) => {
                        console.log("Error inserting item: ", item);
                        console.log("Error message: ", error);
                        reject(error);
                    }
                );
            });
        }, null, resolve);
    });
}


export async function filterByQueryAndCategories(query, activeCategories) {
    return new Promise((resolve, reject) => {
        let placeholders = activeCategories.map(() => '?').join(',');
        let sqlQuery = `SELECT * FROM menuitems WHERE name LIKE ? AND category IN (${placeholders})`;

        db.transaction((tx) => {
            tx.executeSql(
                sqlQuery,
                [`%${query}%`, ...activeCategories],
                (_, { rows }) => {
                    resolve(rows._array);
                },
                (_, err) => reject(err)
            );
        });
    });
}