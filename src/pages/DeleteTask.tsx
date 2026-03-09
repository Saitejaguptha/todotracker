import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FiSearch, FiTrash2 } from 'react-icons/fi';
import { type RootState } from '../store';
import { deleteTask } from '../store/tasksSlice';
import { addActivity } from '../store/activitySlice';
import TaskCard from '../components/features/TaskCard';

const DeleteTask: React.FC = () => {
    const tasks = useSelector((state: RootState) => state.tasks.items);
    const auth = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const { searchByDescription } = useSelector((state: RootState) => state.settings);
    const [searchQuery, setSearchQuery] = useState('');

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

    const handleDelete = (id: string) => {
        const taskToDelete = tasks.find(t => t.id === id);
        if (taskToDelete) {
            dispatch(deleteTask(id));
            dispatch(addActivity({
                type: 'deleted',
                message: `Permanently deleted task: ${taskToDelete.title}`,
                user_id: auth.currentUser?.id || ''
            }));
            toast.error('Task deleted successfully');
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-8 flex flex-col h-full overflow-hidden">
            <div className="flex flex-col gap-1 mb-6 md:mb-8 pb-4 border-b border-indigo-100">
                <h2 className="text-xl md:text-2xl font-bold text-red-900 tracking-tight">Delete Tasks</h2>
                <p className="text-xs md:text-sm text-gray-500 font-medium">Search for tasks you want to permanently remove</p>
            </div>

            <div className="mb-8 max-w-md">
                {/* Search Bar */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Search by Title</label>
                    <div className="relative w-full">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search tasks to delete..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-red-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm md:text-base text-gray-700"
                        />
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-red-50 border-dashed">
                        <p className="text-gray-400 italic">No tasks found matching your search.</p>
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <div key={task.id} className="relative group">
                            <TaskCard
                                task={task}
                                showActions={false}
                            />
                            <div className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2">
                                <button
                                    onClick={() => handleDelete(task.id)}
                                    className="p-2 md:p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center gap-2 font-bold text-xs md:text-sm"
                                    title="Delete Task"
                                >
                                    <FiTrash2 size={16} className="md:size-[18px]" /> <span className="hidden sm:inline">Delete</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DeleteTask;
