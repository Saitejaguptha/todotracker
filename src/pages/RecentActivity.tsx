import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store';
import { FiActivity, FiX, FiCheckCircle, FiClock, FiTrash2, FiPlusCircle, FiEdit } from 'react-icons/fi';
import { clearActivities, addActivity } from '../store/activitySlice';
import { toast } from 'react-hot-toast';

const RecentActivity: React.FC = () => {
    const auth = useSelector((state: RootState) => state.auth);
    const userId = auth.currentUser?.id;
    const activities = useSelector((state: RootState) => state.activity.items);
    const dispatch = useDispatch();

    const handleClearActivity = () => {
        dispatch(clearActivities());
        dispatch(addActivity({
            type: 'deleted',
            message: 'Activity log cleared',
            user_id: userId || ''
        }));
        toast.success('Activity log cleared');
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'completed': return <FiCheckCircle size={18} />;
            case 'pending': return <FiClock size={18} />;
            case 'deleted': return <FiTrash2 size={18} />;
            case 'created': return <FiPlusCircle size={18} />;
            case 'updated': return <FiEdit size={18} />;
            default: return <FiActivity size={18} />;
        }
    };

    const getColors = (type: string) => {
        switch (type) {
            case 'completed': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
            case 'pending': return 'bg-amber-100 text-amber-600 border-amber-200';
            case 'deleted': return 'bg-red-100 text-red-600 border-red-200';
            case 'created': return 'bg-indigo-100 text-indigo-600 border-indigo-200';
            case 'updated': return 'bg-blue-100 text-blue-600 border-blue-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-8 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 pb-4 border-b border-indigo-100">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <FiActivity className="text-indigo-600 shrink-0" size={24} />
                        <h2 className="text-xl md:text-2xl font-bold text-indigo-900 tracking-tight">Recent Activity</h2>
                    </div>
                    <p className="text-gray-500 text-xs md:text-sm">Track all your task-related actions and notifications</p>
                </div>
                {activities.length > 0 && (
                    <button
                        onClick={handleClearActivity}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-all border border-red-100 shadow-sm"
                    >
                        <FiX /> Clear Activity Log
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] border border-indigo-50 border-dashed">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-200 rounded-full flex items-center justify-center mb-4">
                            <FiActivity size={32} />
                        </div>
                        <p className="text-gray-400 font-medium italic">No recent activity recorded yet.</p>
                        <p className="text-gray-300 text-xs mt-1">Actions you take will be logged here for your reference.</p>
                    </div>
                ) : (
                    activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-center justify-between p-4 md:p-5 bg-white rounded-2xl border border-indigo-50 hover:border-indigo-200 transition-all shadow-sm hover:shadow-md group"
                        >
                            <div className="flex items-center gap-3 md:gap-5 flex-1 min-w-0">
                                <div className={`p-2.5 md:p-3 rounded-xl border transition-transform group-hover:scale-110 shrink-0 ${getColors(activity.type)}`}>
                                    {getIcon(activity.type)}
                                </div>
                                <div className="space-y-0.5 min-w-0">
                                    <p className="text-[13px] md:text-sm font-bold text-indigo-900 group-hover:text-indigo-600 transition-colors truncate md:whitespace-normal">
                                        {activity.message}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <FiClock size={10} className="text-gray-300 shrink-0" />
                                        <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">
                                            {activity.timestamp}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentActivity;
