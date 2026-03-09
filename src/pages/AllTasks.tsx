import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../store';
import { FiLayers, FiSearch } from 'react-icons/fi';
import TaskCard from '../components/features/TaskCard';
import TaskModal from '../components/features/TaskModal';
import { type Task } from '../store/tasksSlice';

const AllTasks: React.FC = () => {
    const tasks = useSelector((state: RootState) => state.tasks.items);
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

    return (
        <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-8 flex flex-col h-full overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 pb-4 border-b border-indigo-100">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <FiLayers className="text-indigo-600 shrink-0" size={24} />
                        <h2 className="text-xl md:text-2xl font-bold text-indigo-900 tracking-tight">All Tasks</h2>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 font-medium">Comprehensive list of all your tasks</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6 md:mb-8 w-full max-w-md">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search all tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-indigo-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm md:text-base text-gray-700"
                />
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-indigo-50 border-dashed">
                        <p className="text-gray-400 italic">
                            {searchQuery ? 'No tasks found matching your search.' : 'Your task list is empty.'}
                        </p>
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onClick={handleTaskClick}
                        />
                    ))
                )}
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                task={selectedTask}
            />
        </div>
    );
};

export default AllTasks;
