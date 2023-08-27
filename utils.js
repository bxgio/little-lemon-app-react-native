import {useEffect, useRef} from 'react';

export function getCategoriesListData(data) {
    const groupedByCategory = data.reduce((acc, menuItem) => {
        if (!acc[menuItem.category]) {
            acc[menuItem.category] = [];
        }
        acc[menuItem.category].push({
            uuid: menuItem.uuid,
            name: menuItem.name,
            price: menuItem.price,
            description: menuItem.description,
            image: menuItem.image,
        });
        return acc;
    }, {});

    return Object.entries(groupedByCategory).map(([name, data]) => ({
        name,
        data,
    }));
}

export function useUpdateEffect(effect, dependencies = []) {
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            return effect();
        }
    }, dependencies);
}