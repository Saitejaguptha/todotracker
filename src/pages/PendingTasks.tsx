import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TaskCard from '../components/features/TaskCard';
import TaskModal from '../components/features/TaskModal';
import { FiSearch, FiClock } from 'react-icons/fi';
import { toggleTaskStatusAsync, type Task } from '../store/tasksSlice';
import { addActivity } from '../store/activitySlice';
import { toast } from 'react-hot-toast';
import { type RootState, type AppDispatch } from '../store';

const PendingTasks: React.FC = () => {
    const tasks = useSelector((state: RootState) => state.tasks.items);
    const auth = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const { searchByDescription } = useSelector((state: RootState) => state.settings);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredPendingTasks = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return tasks
            .filter(t => t.status === 'PENDING')
            .filter(task => {
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
        if (action === 'TOGGLE' && selectedTask) {
            try {
                await dispatch(toggleTaskStatusAsync({ id: selectedTask.id, status: selectedTask.status })).unwrap();
                dispatch(addActivity({
                    type: 'updated',
                    message: `Marked task as done: ${selectedTask.title}`,
                    user_id: auth.currentUser?.id || ''
                }));
                toast.success('Task marked as done!');
            } catch (error: any) {
                toast.error(error || 'Failed to update task status');
            }
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-8 flex flex-col h-full overflow-hidden">
            <div className="flex flex-col gap-1 mb-6 md:mb-8 pb-4 border-b border-indigo-100">
                <div className="flex items-center gap-3">
                    <FiClock className="text-amber-600" size={24} />
                    <h2 className="text-xl md:text-2xl font-bold text-indigo-900 tracking-tight">Pending Tasks</h2>
                </div>
                <p className="text-xs md:text-sm text-gray-500 font-medium">Tasks currently in progress</p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6 md:mb-8 w-full max-w-md">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search pending tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-indigo-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm md:text-base text-gray-700"
                />
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {filteredPendingTasks.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-indigo-50 border-dashed">
                        <p className="text-gray-400 italic">
                            {searchQuery ? 'No pending tasks found matching your search.' : 'No pending tasks found.'}
                        </p>
                    </div>
                ) : (
                    filteredPendingTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            variant="pending"
                            showActions={true}
                            onClick={handleTaskClick}
                        />
                    ))
                )}
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                task={selectedTask}
                mode="PENDING"
                onAction={handleAction}
            />
        </div>
    );
};

export default PendingTasks;
