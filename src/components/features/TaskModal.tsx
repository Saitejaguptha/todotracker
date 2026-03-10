import React, { useEffect } from 'react';
import { FiX, FiClock, FiCheckCircle, FiCalendar, FiType, FiAlignLeft, FiTrash2 } from 'react-icons/fi';
import { type Task } from '../../store/tasksSlice';
import { useForm } from 'react-hook-form';

export type TaskModalMode = 'VIEW' | 'EDIT' | 'PENDING' | 'COMPLETED' | 'DELETE';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
    mode?: TaskModalMode;
    onAction?: (action: 'UPDATE' | 'TOGGLE' | 'DELETE' | 'EDIT', data?: Partial<Task>) => void;
}

type TaskFormInputs = {
    title: string;
    description: string;
    status: 'PENDING' | 'DONE';
};

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task, mode = 'VIEW', onAction }) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<TaskFormInputs>();

    // Watch the status field for real-time UI updates in Edit mode
    const watchedStatus = watch('status');

    useEffect(() => {
        if (task) {
            reset({
                title: task.title,
                description: task.description,
                status: task.status,
            });
        }
    }, [task, reset]);

    if (!isOpen || !task) return null;

    const isReadOnly = mode === 'PENDING' || mode === 'COMPLETED' || mode === 'DELETE';
    const isEdit = mode === 'EDIT';
    const isDelete = mode === 'DELETE';

    const currentStatus = isEdit ? watchedStatus : task.status;
    const isDone = currentStatus === 'DONE';

    const onSubmit = (data: TaskFormInputs) => {
        if (onAction) {
            onAction('UPDATE', data);
        }
        onClose();
    };

    const handleToggleStatus = () => {
        if (onAction) {
            onAction('TOGGLE');
        }
        onClose();
    };

    const handleDelete = () => {
        if (onAction) {
            onAction('DELETE');
        }
        onClose();
    };

    const getHeaderIcon = () => {
        if (isDelete) return <FiTrash2 size={28} className="text-red-600" />;
        return isDone ? <FiCheckCircle size={28} className="text-emerald-600" /> : <FiClock size={28} className="text-amber-600" />;
    };

    const getAccentColor = () => {
        if (isDelete) return 'bg-red-600';
        return isDone ? 'bg-emerald-600' : 'bg-amber-600';
    };

    const getButtonColor = () => {
        if (isDelete) return 'bg-red-600 hover:bg-red-700 shadow-red-100';
        return isDone ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200/50' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-200/50';
    };

    const getThemeColors = () => {
        if (isDelete) return { text: 'text-red-900', label: 'text-red-400', bg: 'bg-red-50/50', border: 'border-red-50', focus: 'border-red-500' };
        if (isDone) return { text: 'text-emerald-900', label: 'text-emerald-400', bg: 'bg-emerald-50/50', border: 'border-emerald-50', focus: 'border-emerald-500' };
        return { text: 'text-amber-900', label: 'text-amber-400', bg: 'bg-amber-50/50', border: 'border-amber-50', focus: 'border-amber-500' };
    };

    const colors = getThemeColors();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-indigo-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content Container */}
            <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-indigo-100 max-h-[95vh] md:max-h-[90vh] flex flex-col">
                {/* Accent bar */}
                <div className={`shrink-0 w-full h-2 ${getAccentColor()}`}></div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
                    {/* Scrollable Content Area */}
                    <div className="overflow-y-auto custom-scrollbar flex-1">
                        <div className="p-8 md:p-10 pb-2 md:pb-2">
                            <div className="flex items-start justify-between mb-8">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${isDelete ? 'bg-red-50' : (isDone ? 'bg-emerald-50' : 'bg-amber-50')}`}>
                                    {getHeaderIcon()}
                                </div>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            <div className="space-y-6 md:space-y-8">
                                {/* Title Section */}
                                <div className="space-y-3">
                                    <label className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ${colors.label}`}>
                                        <FiType size={14} /> Task Title
                                    </label>
                                    {isEdit ? (
                                        <div className="space-y-1">
                                            <div className={`p-4 rounded-2xl border transition-all ${colors.bg} ${colors.border} focus-within:ring-2 focus-within:ring-offset-2 ${isDone ? 'focus-within:ring-emerald-100' : 'focus-within:ring-amber-100'} focus-within:border-indigo-500`}>
                                                <input
                                                    {...register('title', { required: 'Title is required' })}
                                                    className={`w-full bg-transparent text-lg font-bold outline-none border-none transition-colors ${colors.text}`}
                                                    placeholder="Task title..."
                                                />
                                            </div>
                                            {errors.title && <p className="text-[10px] text-red-500 font-bold uppercase pl-4">{errors.title.message}</p>}
                                        </div>
                                    ) : (
                                        <h2 className={`text-2xl md:text-3xl font-black tracking-tight leading-tight ${isReadOnly ? 'text-gray-400' : colors.text}`}>
                                            {task.title}
                                        </h2>
                                    )}
                                </div>

                                {/* Description Section */}
                                <div className="space-y-3">
                                    <label className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ${colors.label}`}>
                                        <FiAlignLeft size={14} /> Description
                                    </label>
                                    <div className={`${isReadOnly ? 'bg-gray-50' : colors.bg} p-6 rounded-3xl border ${colors.border} min-h-[100px] md:min-h-[120px]`}>
                                        {isEdit ? (
                                            <textarea
                                                {...register('description')}
                                                rows={3}
                                                className={`w-full bg-transparent text-sm md:text-base leading-relaxed font-medium outline-none resize-none ${colors.text}`}
                                                placeholder="Add a detailed description..."
                                            />
                                        ) : (
                                            <p className={`text-sm md:text-base leading-relaxed font-medium ${isReadOnly ? 'text-gray-400' : colors.text}`}>
                                                {task.description || "No description provided."}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Status Section (only in Edit) */}
                                {isEdit && (
                                    <div className="space-y-3">
                                        <label className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ${colors.label}`}>
                                            <FiClock size={14} /> Task Status
                                        </label>
                                        <div className="flex gap-2 md:gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                                            <button
                                                type="button"
                                                onClick={() => setValue('status', 'PENDING')}
                                                className={`flex-1 py-3 px-3 md:px-4 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${watchedStatus === 'PENDING'
                                                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-200'
                                                    : 'bg-transparent text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                                                    }`}
                                            >
                                                <FiClock size={16} /> Pending
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setValue('status', 'DONE')}
                                                className={`flex-1 py-3 px-3 md:px-4 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${watchedStatus === 'DONE'
                                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                                                    : 'bg-transparent text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                                                    }`}
                                            >
                                                <FiCheckCircle size={16} /> Done
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Metadata Section */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-2xl border border-indigo-50 flex flex-col gap-1">
                                        <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${colors.label}`}>
                                            <FiCalendar size={12} /> Created On
                                        </span>
                                        <span className={`text-sm font-bold ${colors.text}`}>
                                            {task.created_at ? new Date(task.created_at).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl border border-indigo-50 flex flex-col gap-1">
                                        <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${colors.label}`}>
                                            <FiClock size={12} /> Current Status
                                        </span>
                                        <span className={`text-sm font-black uppercase tracking-wide ${isDone ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            {currentStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fixed Action Bar at the Bottom */}
                    <div className="p-8 md:p-10 pt-4 md:pt-4 bg-white border-t border-gray-50 shrink-0">
                        {mode === 'VIEW' && (
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black rounded-2xl transition-all hover:-translate-y-1 active:scale-[0.98]"
                                >
                                    Close
                                </button>
                                {onAction && (
                                    <button
                                        type="button"
                                        onClick={() => onAction('EDIT')}
                                        className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        <FiClock size={20} className="rotate-90" /> Edit Task
                                    </button>
                                )}
                            </div>
                        )}

                        {mode === 'EDIT' && (
                            <button
                                type="submit"
                                className={`w-full py-4 text-white font-black rounded-2xl shadow-xl transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3 ${getButtonColor()}`}
                            >
                                <FiCheckCircle size={20} /> Save Task Changes
                            </button>
                        )}

                        {mode === 'PENDING' && (
                            <button
                                type="button"
                                onClick={handleToggleStatus}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <FiCheckCircle size={20} /> Mark as Done
                            </button>
                        )}

                        {mode === 'COMPLETED' && (
                            <button
                                type="button"
                                onClick={handleToggleStatus}
                                className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-2xl shadow-xl shadow-amber-100 transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <FiClock size={20} /> Mark as Pending
                            </button>
                        )}

                        {mode === 'DELETE' && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-xl shadow-red-100 transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <FiTrash2 size={20} /> Delete Task Permanently
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;

