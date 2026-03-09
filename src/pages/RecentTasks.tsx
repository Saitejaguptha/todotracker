import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../store';
import { FiActivity } from 'react-icons/fi';
import TaskCard from '../components/features/TaskCard';

const RecentTasks: React.FC = () => {
    const tasks = useSelector((state: RootState) => state.tasks.items);

    const recentTasks = useMemo(() => {
        const pending = tasks.filter(t => t.status === 'PENDING').slice(0, 5);
        const completed = tasks.filter(t => t.status === 'DONE').slice(0, 5);
        return [...pending, ...completed].sort(() => Math.random() - 0.5);
    }, [tasks]);

    return (
        <div className="p-8 w-full max-w-5xl mx-auto h-full flex flex-col overflow-hidden">
            <div className="flex items-center gap-3 mb-2">
                <FiActivity className="text-indigo-600" size={24} />
                <h2 className="text-2xl font-bold text-indigo-900">Recently Added Tasks</h2>
            </div>
            <p className="text-gray-500 mb-8">Newest tasks added to your list</p>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {recentTasks.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-indigo-50 border-dashed">
                        <p className="text-gray-400 italic">No tasks available.</p>
                    </div>
                ) : (
                    recentTasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentTasks;
