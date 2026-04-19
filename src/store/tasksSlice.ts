import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';

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
    loadedUserId: string | null;
}

// Helper to transform DB task to App task
const transformTask = (dbTask: any): Task => ({
    ...dbTask,
    // Convert int8 id to string for consistency
    id: String(dbTask.id),
    user_id: String(dbTask.user_id),
    // Map boolean status to PENDING/DONE strings
    status: dbTask.status ? 'DONE' : 'PENDING'
});

// Helper to transform App status to DB boolean
const transformStatusToDB = (status: 'PENDING' | 'DONE'): boolean => status === 'DONE';

// Async Thunks
export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (userId: string | number, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return (data || []).map(transformTask);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const addTaskAsync = createAsyncThunk(
    'tasks/addTask',
    async (task: Omit<Task, 'id' | 'created_at'>, { rejectWithValue }) => {
        try {
            const dbTask = {
                title: task.title,
                description: task.description,
                status: transformStatusToDB(task.status),
                user_id: task.user_id
            };

            const { data, error } = await supabase
                .from('tasks')
                .insert([dbTask])
                .select()
                .single();

            if (error) throw error;
            return transformTask(data);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateTaskAsync = createAsyncThunk(
    'tasks/updateTask',
    async (task: Task, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .update({ 
                    title: task.title, 
                    description: task.description, 
                    status: transformStatusToDB(task.status) 
                })
                .eq('id', task.id)
                .select()
                .single();

            if (error) throw error;
            return transformTask(data);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteTaskAsync = createAsyncThunk(
    'tasks/deleteTask',
    async (taskId: string | number, { rejectWithValue }) => {
        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', taskId);

            if (error) throw error;
            return String(taskId);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const toggleTaskStatusAsync = createAsyncThunk(
    'tasks/toggleTaskStatus',
    async ({ id, status }: { id: string | number; status: 'PENDING' | 'DONE' }, { rejectWithValue }) => {
        try {
            const newStatus = status === 'DONE' ? 'PENDING' : 'DONE';
            const { data, error } = await supabase
                .from('tasks')
                .update({ status: transformStatusToDB(newStatus) })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return transformTask(data);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const markAllStatusAsync = createAsyncThunk(
    'tasks/markAllStatus',
    async ({ userId, status }: { userId: string | number; status: 'DONE' | 'PENDING' }, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .update({ status: transformStatusToDB(status) })
                .eq('user_id', userId)
                .select();

            if (error) throw error;
            return (data || []).map(transformTask);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteAllTasksAsync = createAsyncThunk(
    'tasks/deleteAll',
    async (userId: string | number, { rejectWithValue }) => {
        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('user_id', userId);

            if (error) throw error;
            return String(userId);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState: TasksState = {
    items: [],
    loading: false,
    error: null,
    loadedUserId: null,
};

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        unloadUserTasks: (state) => {
            state.items = [];
            state.loadedUserId = null;
        },
        clearTasksError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Tasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.loadedUserId = String(action.meta.arg); // The userId passed to fetchTasks
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add Task
            .addCase(addTaskAsync.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            // Update Task
            .addCase(updateTaskAsync.fulfilled, (state, action) => {
                const index = state.items.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // Delete Task
            .addCase(deleteTaskAsync.fulfilled, (state, action) => {
                state.items = state.items.filter(t => t.id !== action.payload);
            })
            // Toggle Status
            .addCase(toggleTaskStatusAsync.fulfilled, (state, action) => {
                const index = state.items.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // Mark All Status
            .addCase(markAllStatusAsync.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            // Delete All
            .addCase(deleteAllTasksAsync.fulfilled, (state) => {
                state.items = [];
            });
    }
});

export const {
    unloadUserTasks,
    clearTasksError
} = tasksSlice.actions;

export default tasksSlice.reducer;
