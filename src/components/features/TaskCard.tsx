import React from 'react';
import { FiCheckCircle, FiClock, FiEdit2, FiTrash2, FiRotateCcw } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTaskStatusAsync, type Task } from '../../store/tasksSlice';
import { addActivity } from '../../store/activitySlice';
import { toast } from 'react-hot-toast';
import { type RootState, type AppDispatch } from '../../store';

interface TaskCardProps {
    task: Task;
    onEdit?: (task: Task) => void;
    onDelete?: (id: string) => void;
    onClick?: (task: Task) => void;
    showActions?: boolean;
    variant?: 'default' | 'completed' | 'pending';
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onClick, showActions = false, variant = 'default' }) => {
    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((state: RootState) => state.auth);
    const userId = auth.currentUser?.id;

    const handleCardClick = () => {
        if (onClick) {
            onClick(task);
        }
    };

    const handleToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const newStatus = task.status === 'DONE' ? 'PENDING' : 'DONE';
        try {
            await dispatch(toggleTaskStatusAsync({ id: task.id, status: task.status })).unwrap();
            dispatch(addActivity({
                type: newStatus === 'DONE' ? 'completed' : 'pending',
                message: `Task "${task.title}" marked as ${newStatus.toLowerCase()}`,
                user_id: userId || ''
            }));
            toast.success(`Task marked as ${newStatus.toLowerCase()}`);
        } catch (error: any) {
            toast.error(error || 'Failed to update task status');
        }
    };

    const handleMarkAsPending = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (task.status === 'DONE') {
            try {
                await dispatch(toggleTaskStatusAsync({ id: task.id, status: 'DONE' })).unwrap();
                dispatch(addActivity({ type: 'pending', message: `Task "${task.title}" moved back to pending`, user_id: userId || '' }));
                toast.success('Task moved to pending');
            } catch (error: any) {
                toast.error(error || 'Failed to update task status');
            }
        }
    };

    const handleMarkAsDone = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (task.status === 'PENDING') {
            try {
                await dispatch(toggleTaskStatusAsync({ id: task.id, status: 'PENDING' })).unwrap();
                dispatch(addActivity({ type: 'completed', message: `Task "${task.title}" marked as completed`, user_id: userId || '' }));
                toast.success('Task marked as completed!');
            } catch (error: any) {
                toast.error(error || 'Failed to update task status');
            }
        }
    };

    const isCompletedVariant = variant === 'completed';
    const isPendingVariant = variant === 'pending';

    return (
        <div
            onClick={handleCardClick}
            className={`p-4 md:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${onClick ? 'cursor-pointer' : ''
                } ${isCompletedVariant
                    ? 'bg-gray-50/50 border-gray-100 opacity-80'
                    : isPendingVariant
                        ? 'bg-white border-amber-50 shadow-sm hover:shadow-md hover:border-amber-200'
                        : 'bg-white border-indigo-50 shadow-sm hover:shadow-md hover:border-indigo-200'
                }`}>
            <div className="flex items-start md:items-center gap-3 md:gap-4 flex-1 min-w-0">
                <button
                    onClick={handleToggle}
                    className={`mt-1 md:mt-0 p-2 rounded-lg transition-colors shrink-0 ${task.status === 'DONE'
                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                        }`}
                >
                    {task.status === 'DONE' ? <FiCheckCircle size={18} /> : <FiClock size={18} />}
                </button>

                <div className="flex-1 min-w-0">
                    <h3 className={`text-sm md:text-base leading-snug break-words transition-all ${task.status === 'DONE'
                        ? 'font-bold text-indigo-900'
                        : 'font-semibold text-gray-800'
                        } ${isCompletedVariant ? 'text-gray-400 font-medium' : ''}`}>
                        {task.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <p className={`text-[9px] md:text-[10px] uppercase tracking-wider font-bold ${isCompletedVariant ? 'text-gray-300' : 'text-gray-400'}`}>
                            {task.status}
                        </p>
                        {task.created_at && (
                            <>
                                <span className="text-gray-300 hidden md:inline">•</span>
                                <p className="text-[9px] md:text-[10px] text-gray-400">{new Date(task.created_at).toLocaleDateString()}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 sm:shrink-0">
                {showActions && (
                    <>
                        {isCompletedVariant ? (
                            <button
                                onClick={handleMarkAsPending}
                                className="flex-1 sm:flex-none px-3 py-1.5 text-[11px] md:text-xs font-bold bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-all flex items-center justify-center gap-1.5"
                            >
                                <FiRotateCcw size={12} /> <span className="whitespace-nowrap">Mark Pending</span>
                            </button>
                        ) : isPendingVariant ? (
                            <button
                                onClick={handleMarkAsDone}
                                className="flex-1 sm:flex-none px-3 py-1.5 text-[11px] md:text-xs font-bold bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all flex items-center justify-center gap-1.5"
                            >
                                <FiCheckCircle size={12} /> <span className="whitespace-nowrap">Mark Done</span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-1 md:gap-2">
                                {onEdit && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        title="Edit Task"
                                    >
                                        <FiEdit2 size={18} />
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Task"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TaskCard;

