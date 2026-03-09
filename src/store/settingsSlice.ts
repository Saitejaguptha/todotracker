import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
    searchByDescription: boolean;
    notificationsEnabled: {
        create: boolean;
        edit: boolean;
        complete: boolean;
    };
}

const loadSettings = (): SettingsState => {
    const saved = localStorage.getItem('user_settings');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load settings', e);
        }
    }
    return {
        searchByDescription: false,
        notificationsEnabled: {
            create: true,
            edit: true,
            complete: true
        }
    };
};

const saveSettings = (settings: SettingsState) => {
    localStorage.setItem('user_settings', JSON.stringify(settings));
};

const initialState: SettingsState = loadSettings();

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        toggleSearchByDescription: (state) => {
            state.searchByDescription = !state.searchByDescription;
            saveSettings(state);
        },
        updateNotificationPreference: (state, action: PayloadAction<{ id: 'create' | 'edit' | 'complete', value: boolean }>) => {
            state.notificationsEnabled[action.payload.id] = action.payload.value;
            saveSettings(state);
        }
    },
});

export const { toggleSearchByDescription, updateNotificationPreference } = settingsSlice.actions;
export default settingsSlice.reducer;
