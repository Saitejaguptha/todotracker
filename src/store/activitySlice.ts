import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Activity {
    id: string;
    type: 'completed' | 'pending' | 'deleted' | 'created' | 'updated';
    message: string;
    timestamp: string;
    user_id: string;
}

interface ActivityState {
    items: Activity[];
    currentUserEmail: string | null;
}

// User-scoped key so different users on the same device never share activity logs
export const getActivitiesKey = (email: string) => `activities_${email}`;

const loadActivitiesForUser = (email: string): Activity[] => {
    const saved = localStorage.getItem(getActivitiesKey(email));
    if (saved) {
        try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
};

const persistActivities = (items: Activity[], email: string | null) => {
    if (email) localStorage.setItem(getActivitiesKey(email), JSON.stringify(items));
};

const initialState: ActivityState = {
    items: [],
    currentUserEmail: null,
};

const activitySlice = createSlice({
    name: 'activity',
    initialState,
    reducers: {
        /** Dispatched right after sign-in / sign-up */
        loadUserActivities: (state, action: PayloadAction<string>) => {
            state.currentUserEmail = action.payload;
            state.items = loadActivitiesForUser(action.payload);
        },
        /** Dispatched on logout */
        unloadUserActivities: (state) => {
            state.items = [];
            state.currentUserEmail = null;
        },
        addActivity: (state, action: PayloadAction<Omit<Activity, 'id' | 'timestamp'>>) => {
            const newActivity: Activity = {
                ...action.payload,
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toLocaleString(),
            };
            state.items.unshift(newActivity);
            if (state.items.length > 50) {
                state.items = state.items.slice(0, 50);
            }
            persistActivities(state.items, state.currentUserEmail);
        },
        clearActivities: (state) => {
            state.items = [];
            persistActivities(state.items, state.currentUserEmail);
        },
    },
});

export const { loadUserActivities, unloadUserActivities, addActivity, clearActivities } = activitySlice.actions;
export default activitySlice.reducer;
