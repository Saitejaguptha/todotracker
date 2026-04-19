import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useSelector, useDispatch } from 'react-redux';
import { setSidebarOpen } from '../../store/uiSlice';
import { fetchTasks } from '../../store/tasksSlice';
import { loadUserActivities } from '../../store/activitySlice';
import { type RootState, type AppDispatch } from '../../store';

const SlackLayout: React.FC = () => {
    const isSidebarOpen = useSelector((state: RootState) => state.ui.isSidebarOpen);
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    const loadedUserId = useSelector((state: RootState) => state.tasks.loadedUserId);
    const dispatch = useDispatch<AppDispatch>();

    // Handle page refresh: if user is logged in but data isn't loaded yet, load it now
    React.useEffect(() => {
        if (currentUser?.id && loadedUserId !== currentUser.id) {
            dispatch(fetchTasks(currentUser.id));
            dispatch(loadUserActivities(currentUser.email));
        }
    }, [currentUser, loadedUserId, dispatch]);

    return (
        <div className="flex flex-col h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-indigo-50 text-gray-900 font-sans">
            <Header />
            <div className="flex flex-1 overflow-hidden relative">
                {/* Mobile Backdrop */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-indigo-900/40 backdrop-blur-sm z-30 lg:hidden transition-all duration-300"
                        onClick={() => dispatch(setSidebarOpen(false))}
                    />
                )}

                <div className={`
                    fixed inset-y-0 left-0 z-40 lg:static lg:z-auto
                    transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    <Sidebar />
                </div>

                <main className="flex-1 flex flex-col overflow-hidden min-w-0 bg-white">
                    <div className="flex-1 overflow-y-auto px-4 md:px-5 py-8 flex flex-col items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <Outlet />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default SlackLayout;
