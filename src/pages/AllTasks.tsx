import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store';
import { FiLayers, FiSearch } from 'react-icons/fi';
import TaskCard from '../components/features/TaskCard';
import TaskModal from '../components/features/TaskModal';
import { updateTask, deleteTask, toggleTaskStatus, type Task } from '../store/tasksSlice';
import { addActivity } from '../store/activitySlice';
import { toast } from 'react-hot-toast';

const AllTasks: React.FC = () => {
    const tasks = useSelector((state: RootState) => state.tasks.items);
    const auth = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    const { searchByDescription } = useSelector((state: RootState) => state.settings);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'VIEW' | 'EDIT' | 'DELETE'>('VIEW');

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
        setModalMode('VIEW');
        setIsModalOpen(true);
    };

    const handleEdit = (task: Task) => {
        setSelectedTask(task);
        setModalMode('EDIT');
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            setSelectedTask(task);
            setModalMode('DELETE');
            setIsModalOpen(true);
        }
    };

    const handleAction = (action: 'UPDATE' | 'TOGGLE' | 'DELETE' | 'EDIT', data?: Partial<Task>) => {
        if (!selectedTask) return;

        if (action === 'EDIT') {
            setModalMode('EDIT');
            return;
        }

        if (action === 'TOGGLE') {
            dispatch(toggleTaskStatus(selectedTask.id));
            const newStatus = selectedTask.status === 'DONE' ? 'PENDING' : 'DONE';
            dispatch(addActivity({
                type: 'updated',
                message: `Marked task as ${newStatus.toLowerCase()}: ${selectedTask.title}`,
                user_id: auth.currentUser?.id || ''
            }));
            toast.success(`Task marked as ${newStatus.toLowerCase()}`);
            setIsModalOpen(false);
            return;
        }

        if (action === 'DELETE') {
            dispatch(deleteTask(selectedTask.id));
            dispatch(addActivity({
                type: 'deleted',
                message: `Deleted task: ${selectedTask.title}`,
                user_id: auth.currentUser?.id || ''
            }));
            toast.success('Task deleted permanently');
            setIsModalOpen(false);
            return;
        }

        if (action === 'UPDATE' && data) {
            const updatedTask = { ...selectedTask, ...data };
            dispatch(updateTask(updatedTask));
            dispatch(addActivity({
                type: 'updated',
                message: `Updated task details: ${updatedTask.title}`,
                user_id: auth.currentUser?.id || ''
            }));
            toast.success('Task updated successfully');
            setIsModalOpen(false);
        }
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
                            showActions={true}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onClick={handleTaskClick}
                        />
                    ))
                )}
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                task={selectedTask}
                mode={modalMode}
                onAction={handleAction}
            />
        </div>
    );
};

export default AllTasks;
