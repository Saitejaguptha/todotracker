import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Task {
    id: string;
    created_at: string;
    title: string;
    description: string;
    status: 'PENDING' | 'DONE';
    user_id: string;
}

interface TasksState {
    items: Task[];
    loading: boolean;
    error: string | null;
    currentUserEmail: string | null;
}

// User-scoped key so different users on the same device never share data
export const getTasksKey = (email: string) => `tasks_${email}`;

const loadTasksForUser = (email: string): Task[] => {
    const saved = localStorage.getItem(getTasksKey(email));
    if (saved) {
        try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
};

const persistTasks = (items: Task[], email: string | null) => {
    if (email) localStorage.setItem(getTasksKey(email), JSON.stringify(items));
};

const initialState: TasksState = {
    items: [],
    loading: false,
    error: null,
    currentUserEmail: null,
};

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        /** Dispatched right after sign-in / sign-up */
        loadUserTasks: (state, action: PayloadAction<string>) => {
            state.currentUserEmail = action.payload;
            state.items = loadTasksForUser(action.payload);
        },
        /** Dispatched on logout */
        unloadUserTasks: (state) => {
            state.items = [];
            state.currentUserEmail = null;
        },
        addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'created_at'>>) => {
            const newTask: Task = {
                ...action.payload,
                id: crypto.randomUUID(),
                created_at: new Date().toISOString()
            };
            state.items.unshift(newTask);
            persistTasks(state.items, state.currentUserEmail);
        },
        updateTask: (state, action: PayloadAction<Task>) => {
            const index = state.items.findIndex(t => t.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
                persistTasks(state.items, state.currentUserEmail);
            }
        },
        deleteTask: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(t => t.id !== action.payload);
            persistTasks(state.items, state.currentUserEmail);
        },
        toggleTaskStatus: (state, action: PayloadAction<string>) => {
            const index = state.items.findIndex(t => t.id === action.payload);
            if (index !== -1) {
                state.items[index].status = state.items[index].status === 'DONE' ? 'PENDING' : 'DONE';
                persistTasks(state.items, state.currentUserEmail);
            }
        },
        markAllStatus: (state, action: PayloadAction<{ userId: string; status: 'DONE' | 'PENDING' }>) => {
            state.items = state.items.map(t =>
                t.user_id === action.payload.userId ? { ...t, status: action.payload.status } : t
            );
            persistTasks(state.items, state.currentUserEmail);
        },
        deleteAll: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(t => t.user_id !== action.payload);
            persistTasks(state.items, state.currentUserEmail);
        },
        clearTasksError: (state) => {
            state.error = null;
        }
    }
});

export const {
    loadUserTasks,
    unloadUserTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    markAllStatus,
    deleteAll,
    clearTasksError
} = tasksSlice.actions;

export default tasksSlice.reducer;
