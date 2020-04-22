import {createSelector} from "reselect";


export const activitiesList = state => state.activities.list;
export const searchKey = state => state.activities.search;

export const activitiesEnabled = createSelector([activitiesList], (list) => {
    return Object.values(list).filter(i => i.status);
});

export const activitiesFiltered = createSelector([activitiesEnabled, searchKey], (list, searchKey, filters, seed) => {
    let activities = Object.values(list);
    let search = searchKey || "";
    let filtered = activities;
    if (search) {
        filtered = filtered.filter(item => {
            return (
                item.name.toUpperCase().includes(search.toUpperCase()) ||
                item.category.toUpperCase().includes(search.toUpperCase()) ||
                item.description.toUpperCase().includes(search.toUpperCase())
            );
        });
    }
    let grouped = filtered.reduce((results, item) => {
        (results[item.category] = results[item.category] || []).push(item);
        return results;
    }, {});
    let remapped = Object.keys(grouped).map(g => ({key: g, items: grouped[g]})).filter(g => g.items.length);
    return remapped;
});