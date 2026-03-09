import { useSelector, useDispatch } from 'react-redux';
import { FiCheckCircle, FiClock, FiTrash2, FiBell, FiSearch } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { type RootState } from '../store';
import {
    markAllStatus,
    deleteAll
} from '../store/tasksSlice';
import { addActivity } from '../store/activitySlice';
import { toggleSearchByDescription, updateNotificationPreference } from '../store/settingsSlice';

const Settings: React.FC = () => {
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth);
    const userId = auth.currentUser?.id;
    const { searchByDescription, notificationsEnabled } = useSelector((state: RootState) => state.settings);

    const handleMarkAllCompleted = () => {
        if (!userId) return;
        dispatch(markAllStatus({ userId, status: 'DONE' }));
        dispatch(addActivity({ type: 'completed', message: 'Marked all tasks as completed', user_id: userId }));
        toast.success('All tasks marked as completed!');
    };

    const handleMarkAllPending = () => {
        if (!userId) return;
        dispatch(markAllStatus({ userId, status: 'PENDING' }));
        dispatch(addActivity({ type: 'pending', message: 'Marked all tasks as pending', user_id: userId }));
        toast.success('All tasks marked as pending!');
    };

    const handleDeleteAll = () => {
        if (!userId) return;
        dispatch(deleteAll(userId));
        dispatch(addActivity({ type: 'deleted', message: 'Deleted all tasks from the list', user_id: userId }));
        toast.error('All tasks deleted successfully!');
    };

    const handleToggleSearch = () => {
        const newValue = !searchByDescription;
        dispatch(toggleSearchByDescription());
        dispatch(addActivity({
            type: 'updated',
            message: `${newValue ? 'Enabled' : 'Disabled'} search in task descriptions`,
            user_id: userId || ''
        }));
        toast.success(`Search by description ${newValue ? 'enabled' : 'disabled'}`);
    };

    const handleNotificationToggle = (id: 'create' | 'edit' | 'complete', label: string) => {
        const newValue = !notificationsEnabled[id];
        dispatch(updateNotificationPreference({ id, value: newValue }));
        dispatch(addActivity({
            type: 'updated',
            message: `${newValue ? 'Enabled' : 'Disabled'} notifications for: ${label}`,
            user_id: userId || ''
        }));
        toast.success(`${label} notifications ${newValue ? 'enabled' : 'disabled'}`);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-indigo-900 mb-2">Settings</h2>
            <p className="text-gray-600 mb-8">Manage your task preferences and application state.</p>

            <div className="space-y-6">
                {/* Task Management Section */}
                <section className="bg-white p-4 md:p-6 rounded-2xl border border-indigo-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                        Task Management Actions
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Bulk actions to manage your entire task list at once.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <button
                            onClick={handleMarkAllCompleted}
                            className="flex flex-col items-center justify-center p-4 md:p-6 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-all group"
                        >
                            <FiCheckCircle size={24} className="mb-2 md:mb-3 group-hover:scale-110 transition-transform md:size-[28px]" />
                            <span className="font-medium text-xs md:text-sm">Mark All Completed</span>
                        </button>

                        <button
                            onClick={handleMarkAllPending}
                            className="flex flex-col items-center justify-center p-6 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 hover:bg-amber-100 transition-all group"
                        >
                            <FiClock size={28} className="mb-3 group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-sm">Mark All Pending</span>
                        </button>

                        <button
                            onClick={handleDeleteAll}
                            className="flex flex-col items-center justify-center p-6 bg-red-50 text-red-700 rounded-xl border border-red-100 hover:bg-red-100 transition-all group"
                        >
                            <FiTrash2 size={28} className="mb-3 group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-sm">Delete All Tasks</span>
                        </button>
                    </div>
                </section>

                {/* Search Preferences Section */}
                <section className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                        <FiSearch className="text-indigo-500" /> Search Preferences
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Configure how the search bar behaves across your task lists.
                    </p>

                    <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:border-indigo-200 transition-all group">
                            <div className="flex-1">
                                <p className="text-sm font-bold text-indigo-900 group-hover:text-indigo-600 transition-colors">Include Description in Search</p>
                                <p className="text-xs text-gray-500 mt-0.5">When enabled, the search bar will look through both task titles and their descriptions.</p>
                            </div>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={searchByDescription}
                                    onChange={handleToggleSearch}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </div>
                        </label>
                    </div>
                </section>

                {/* Notification Preferences Section */}
                <section className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                        <FiBell className="text-indigo-500" /> Notification Preferences
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Choose which activities you'd like to be notified about.
                    </p>

                    <div className="space-y-4">
                        {[
                            { id: 'create' as const, label: 'Task Created', description: 'Get a notification when a new task is added.' },
                            { id: 'edit' as const, label: 'Task Edited', description: 'Get a notification when an existing task is updated.' },
                            { id: 'complete' as const, label: 'Task Completed', description: 'Get a notification when a task is marked as done.' }
                        ].map((pref) => (
                            <label key={pref.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:border-indigo-200 transition-all group">
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-indigo-900 group-hover:text-indigo-600 transition-colors">{pref.label}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{pref.description}</p>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={notificationsEnabled[pref.id]}
                                        onChange={() => handleNotificationToggle(pref.id, pref.label)}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </div>
                            </label>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
