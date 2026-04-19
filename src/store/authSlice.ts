import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';

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
    isLoggedIn: boolean;
    loading: boolean;
    error: string | null;
}

const loadAuth = () => {
    const savedSession = localStorage.getItem('auth_session');
    if (savedSession) {
        try {
            const data = JSON.parse(savedSession);
            // If ID contains @, it's an old localStorage session based on email
            // Supabase uses UUIDs, so we must invalidate old sessions to prevent 400 errors
            if (data.user && data.user.id.includes('@')) {
                localStorage.removeItem('auth_session');
                return { currentUser: null, isLoggedIn: false };
            }
            return {
                currentUser: data.user,
                isLoggedIn: !!data.user
            };
        } catch (e) {
            console.error('Failed to load auth session', e);
        }
    }
    return { currentUser: null, isLoggedIn: false };
};

const saveAuth = (user: User | null) => {
    if (user) {
        localStorage.setItem('auth_session', JSON.stringify({ user }));
    } else {
        localStorage.removeItem('auth_session');
    }
};

// Helper to transform DB user to App user
const transformUser = (dbUser: any): User => ({
    ...dbUser,
    id: String(dbUser.id)
});

// Async Thunks
export const signUpUser = createAsyncThunk(
    'auth/signUp',
    async (userData: Omit<User, 'id' | 'created_at'>, { rejectWithValue }) => {
        try {
            // Check if user already exists
            const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('email', userData.email)
                .maybeSingle();

            if (existingUser) {
                return rejectWithValue('User with this email already exists.');
            }

            const hashedPassword = await bcrypt.hash(userData.password!, 10);
            const { data, error } = await supabase
                .from('users')
                .insert([{ ...userData, password: hashedPassword }])
                .select()
                .single();

            if (error) throw error;
            return transformUser(data);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const signInUser = createAsyncThunk(
    'auth/signIn',
    async ({ email, password }: { email: string; password?: string }, { rejectWithValue }) => {
        try {
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .maybeSingle();

            if (error || !user) {
                return rejectWithValue('User not found. Please sign up.');
            }

            if (password) {
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return rejectWithValue('Incorrect password.');
                }
            }

            // Remove password from user object before returning to state
            const { password: _, ...userWithoutPassword } = user;
            return transformUser(userWithoutPassword);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateProfileAsync = createAsyncThunk(
    'auth/updateProfile',
    async (userData: Partial<User> & { id: string }, { rejectWithValue }) => {
        try {
            const { id, ...changes } = userData;
            
            // If updating password, hash it
            if (changes.password) {
                changes.password = await bcrypt.hash(changes.password, 10);
            }

            const { data, error } = await supabase
                .from('users')
                .update(changes)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            
            // Remove password from user object
            const { password: _, ...userWithoutPassword } = data;
            return transformUser(userWithoutPassword);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState: AuthState = {
    ...loadAuth(),
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.currentUser = null;
            state.isLoggedIn = false;
            state.error = null;
            saveAuth(null);
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Sign Up
            .addCase(signUpUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
                state.isLoggedIn = true;
                saveAuth(action.payload);
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Sign In
            .addCase(signInUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signInUser.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
                state.isLoggedIn = true;
                saveAuth(action.payload);
            })
            .addCase(signInUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Profile
            .addCase(updateProfileAsync.fulfilled, (state, action) => {
                state.currentUser = action.payload;
                saveAuth(action.payload);
            })
            .addCase(updateProfileAsync.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
