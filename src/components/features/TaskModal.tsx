import React from 'react';
import { FiX, FiClock, FiCheckCircle, FiCalendar, FiType, FiAlignLeft } from 'react-icons/fi';
import { type Task } from '../../store/tasksSlice';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task }) => {
    if (!isOpen || !task) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-indigo-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-indigo-100">
                {/* Accent bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>

                <div className="p-8 md:p-10">
                    <div className="flex items-start justify-between mb-8">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                            {task.status === 'DONE' ? <FiCheckCircle size={28} /> : <FiClock size={28} />}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    <div className="space-y-8">
                        {/* Title Section */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-black text-indigo-400 uppercase tracking-widest">
                                <FiType size={14} /> Task Title
                            </label>
                            <h2 className="text-2xl md:text-3xl font-black text-indigo-900 tracking-tight leading-tight">
                                {task.title}
                            </h2>
                        </div>

                        {/* Description Section */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-black text-indigo-400 uppercase tracking-widest">
                                <FiAlignLeft size={14} /> Description
                            </label>
                            <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-50 min-h-[120px]">
                                <p className="text-indigo-900 text-sm md:text-base leading-relaxed font-medium">
                                    {task.description || "No description provided."}
                                </p>
                            </div>
                        </div>

                        {/* Metadata Section */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-2xl border border-indigo-100 flex flex-col gap-1">
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <FiCalendar size={12} /> Created On
                                </span>
                                <span className="text-sm font-bold text-indigo-900">
                                    {task.created_at ? new Date(task.created_at).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-indigo-100 flex flex-col gap-1">
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <FiClock size={12} /> Status
                                </span>
                                <span className={`text-sm font-black uppercase tracking-wide ${task.status === 'DONE' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    {task.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10">
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
