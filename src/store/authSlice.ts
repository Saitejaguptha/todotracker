import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: string;
    created_at?: string;
    name: string;
    email: string;
    gender: 'male' | 'female' | 'other';
    password?: string;
}

interface AuthState {
    currentUser: User | null;
    users: User[];
    isLoggedIn: boolean;
    loading: boolean;
    error: string | null;
}

const loadAuth = () => {
    const savedSession = localStorage.getItem('auth_session');
    const savedUsers = localStorage.getItem('app_users');

    let currentUser = null;
    let users = [];

    if (savedSession) {
        try {
            const data = JSON.parse(savedSession);
            currentUser = data.user;
        } catch (e) {
            console.error('Failed to load auth session', e);
        }
    }

    if (savedUsers) {
        try {
            users = JSON.parse(savedUsers);
        } catch (e) {
            console.error('Failed to load users', e);
        }
    }

    return {
        currentUser,
        users,
        isLoggedIn: !!currentUser
    };
};

const saveAuth = (user: User | null) => {
    localStorage.setItem('auth_session', JSON.stringify({ user }));
};

const saveUsers = (users: User[]) => {
    localStorage.setItem('app_users', JSON.stringify(users));
};

const initialState: AuthState = {
    ...loadAuth(),
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signUp: (state, action: PayloadAction<Omit<User, 'id' | 'created_at'>>) => {
            const newUser: User = {
                ...action.payload,
                id: crypto.randomUUID(),
                created_at: new Date().toISOString()
            };

            const existingUser = state.users.find(u => u.email === newUser.email);
            if (existingUser) {
                state.error = 'User with this email already exists.';
                return;
            }

            state.users.push(newUser);
            state.currentUser = newUser;
            state.isLoggedIn = true;
            state.error = null;
            saveUsers(state.users);
            saveAuth(newUser);
        },
        signIn: (state, action: PayloadAction<{ email: string; password?: string }>) => {
            const user = state.users.find(u => u.email === action.payload.email);

            if (!user) {
                state.error = 'User not found. Please sign up.';
                return;
            }

            if (action.payload.password && user.password !== action.payload.password) {
                state.error = 'Incorrect password.';
                return;
            }

            state.currentUser = user;
            state.isLoggedIn = true;
            state.error = null;
            saveAuth(user);
        },
        logout: (state) => {
            state.currentUser = null;
            state.isLoggedIn = false;
            state.error = null;
            saveAuth(null);
        },
        updateProfile: (state, action: PayloadAction<Partial<User> & { id: string }>) => {
            const { id, ...changes } = action.payload;
            const index = state.users.findIndex(u => u.id === id);

            if (index !== -1) {
                state.users[index] = { ...state.users[index], ...changes };
                if (state.currentUser?.id === id) {
                    state.currentUser = state.users[index];
                }
                saveUsers(state.users);
                saveAuth(state.currentUser);
            }
        },
        clearError: (state) => {
            state.error = null;
        }
    }
});

export const { signUp, signIn, logout, updateProfile, clearError } = authSlice.actions;
export default authSlice.reducer;
