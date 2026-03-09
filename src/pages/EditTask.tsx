import React, { useState, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch, FiX } from 'react-icons/fi';
import { type RootState } from '../store';
import { updateTask, type Task } from '../store/tasksSlice';
import { addActivity } from '../store/activitySlice';
import TaskCard from '../components/features/TaskCard';

type EditTaskFormInputs = {
    title: string;
    description: string;
    status: 'PENDING' | 'DONE';
};

const EditTask: React.FC = () => {
    const tasks = useSelector((state: RootState) => state.tasks.items);
    const auth = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const { searchByDescription } = useSelector((state: RootState) => state.settings);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const filteredTasks = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return tasks.filter(task => {
            const matchesTitle = task.title.toLowerCase().includes(query);
            if (searchByDescription && !matchesTitle) {
                return task.description.toLowerCase().includes(query);
            }
            return matchesTitle;
        });
    }, [tasks, searchQuery, searchByDescription]);


    const handleEdit = (task: Task) => {
        setEditingTask(task);
    };

    const closePortal = () => {
        setEditingTask(null);
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-8 flex flex-col h-full overflow-hidden">
            <div className="flex flex-col gap-1 mb-6 md:mb-8 pb-4 border-b border-indigo-100">
                <h2 className="text-xl md:text-2xl font-bold text-indigo-900 tracking-tight">Edit</h2>
                <p className="text-xs md:text-sm text-gray-500 font-medium">Search and modify your existing tasks</p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6 md:mb-8 w-full max-w-md">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search tasks by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-indigo-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm md:text-base text-gray-700"
                />
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-indigo-50 border-dashed">
                        <p className="text-gray-400 italic">No tasks found matching your search.</p>
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            showActions={true}
                            onEdit={handleEdit}
                        />
                    ))
                )}
            </div>

            {/* Edit Modal */}
            {editingTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-indigo-50 flex items-center justify-between bg-indigo-50/30">
                            <h3 className="text-lg font-bold text-indigo-900">Edit Task Details</h3>
                            <button onClick={closePortal} className="text-gray-400 hover:text-red-500 transition-colors">
                                <FiX size={20} />
                            </button>
                        </div>

                        <EditForm
                            task={editingTask}
                            onClose={closePortal}
                            onUpdate={(updatedTask) => {
                                dispatch(updateTask(updatedTask));
                                dispatch(addActivity({ type: 'updated', message: `Updated task details: ${updatedTask.title}`, user_id: auth.currentUser?.id || '' }));
                                closePortal();
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

interface EditFormProps {
    task: Task;
    onClose: () => void;
    onUpdate: (updatedTask: Task) => void;
}

const EditForm: React.FC<EditFormProps> = ({ task, onClose, onUpdate }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EditTaskFormInputs>({
        defaultValues: {
            title: task.title,
            description: task.description,
            status: task.status,
        },
    });

    const onSubmit: SubmitHandler<EditTaskFormInputs> = (data) => {
        onUpdate({ ...task, ...data });
        toast.success('Task updated successfully');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-2">Task Title</label>
                <input
                    {...register('title', { required: 'Title is required' })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-2">Description</label>
                <textarea
                    rows={4}
                    {...register('description')}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-3">Status</label>
                <div className="flex gap-4">
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

            <div className="pt-4 border-t border-indigo-50 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 text-gray-500 font-medium hover:bg-gray-50 rounded-xl transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                >
                    Update Task
                </button>
            </div>
        </form>
    );
};

export default EditTask;
