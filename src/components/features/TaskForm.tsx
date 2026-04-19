import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { addTaskAsync } from '../../store/tasksSlice';
import { addActivity } from '../../store/activitySlice';
import { type RootState, type AppDispatch } from '../../store';

import { FiPlusCircle } from 'react-icons/fi';

type TaskFormInputs = {
    title: string;
    description: string;
    status: 'PENDING' | 'DONE';
};

const TaskForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((state: RootState) => state.auth);
    const userId = auth.currentUser?.id;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TaskFormInputs>({
        defaultValues: {
            status: 'PENDING'
        }
    });

    const onSubmit: SubmitHandler<TaskFormInputs> = async (data) => {
        if (!userId) {
            toast.error('You must be logged in to create tasks');
            return;
        }

        setIsSubmitting(true);
        try {
            await dispatch(addTaskAsync({
                ...data,
                user_id: userId
            })).unwrap();
            
            dispatch(addActivity({ type: 'created', message: `Created new task: ${data.title} `, user_id: userId }));
            toast.success('Task created successfully!');
            reset();
        } catch (error: any) {
            toast.error(error || 'Failed to create task');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-8 flex flex-col items-center">
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 pb-4 border-b border-indigo-100">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <FiPlusCircle className="text-indigo-600 shrink-0" size={24} />
                        <h2 className="text-xl md:text-2xl font-bold text-indigo-900 tracking-tight">Create New Task</h2>
                    </div>
                    <p className="text-gray-500 text-xs md:text-sm">Ready to get things done? Add a new task to your list.</p>
                </div>
                <button
                    type="submit"
                    form="create-task-form"
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95 transition-all text-sm md:text-base ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isSubmitting ? 'Saving...' : 'Save Task'}
                </button>
            </div>

            <div className="w-full max-w-2xl">
                <form id="create-task-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white border border-indigo-100 p-6 rounded-3xl shadow-xl relative overflow-hidden h-fit">
                    {/* Dynamic Background Element */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>

                    {/* Task Title */}
                    <div className="space-y-1.5">
                        <label htmlFor="title" className="block text-sm font-semibold text-indigo-900">
                            Task Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.title ? 'border-red-500 bg-red-50' : 'border-gray-100'}`}
                            placeholder="E.g., Complete project documentation"
                            {...register('title', { required: 'Task title is required' })}
                        />
                        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
                    </div>

                    {/* Task Description */}
                    <div className="space-y-1.5">
                        <label htmlFor="description" className="block text-sm font-semibold text-indigo-900">
                            Task Description
                        </label>
                        <textarea
                            id="description"
                            rows={3}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                            placeholder="Add any additional details here..."
                            {...register('description')}
                        />
                    </div>

                    {/* Status Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-indigo-900">
                            Task Status
                        </label>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    value="PENDING"
                                    {...register('status')}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-amber-600 transition-colors">Pending</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    value="DONE"
                                    {...register('status')}
                                    className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-emerald-600 transition-colors">Done</span>
                            </label>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
