import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FiSearch, FiTrash2 } from 'react-icons/fi';
import { deleteTaskAsync, type Task } from '../store/tasksSlice';
import { addActivity } from '../store/activitySlice';
import { type RootState, type AppDispatch } from '../store';
import TaskCard from '../components/features/TaskCard';
import TaskModal from '../components/features/TaskModal';

const DeleteTask: React.FC = () => {
    const tasks = useSelector((state: RootState) => state.tasks.items);
    const auth = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const { searchByDescription } = useSelector((state: RootState) => state.settings);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleAction = async (action: string) => {
        if (action === 'DELETE' && selectedTask) {
            try {
                await dispatch(deleteTaskAsync(selectedTask.id)).unwrap();
                dispatch(addActivity({
                    type: 'deleted',
                    message: `Permanently deleted task: ${selectedTask.title}`,
                    user_id: auth.currentUser?.id || ''
                }));
                toast.error('Task deleted successfully');
                setIsModalOpen(false);
            } catch (error: any) {
                toast.error(error || 'Failed to delete task');
            }
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-8 flex flex-col h-full overflow-hidden">
            <div className="flex flex-col gap-1 mb-6 md:mb-8 pb-4 border-b border-indigo-100">
                <div className="flex items-center gap-3">
                    <FiTrash2 className="text-red-900" size={24} />
                    <h2 className="text-xl md:text-2xl font-bold text-red-900 tracking-tight">Delete Tasks</h2>
                </div>
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
                        <TaskCard
                            key={task.id}
                            task={task}
                            showActions={false}
                            onClick={handleTaskClick}
                        />
                    ))
                )}
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                task={selectedTask}
                mode="DELETE"
                onAction={handleAction}
            />
        </div>
    );
};

export default DeleteTask;
