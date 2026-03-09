import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { unloadUserTasks } from '../store/tasksSlice';
import { unloadUserActivities } from '../store/activitySlice';

const Logout: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(unloadUserTasks());
            dispatch(unloadUserActivities());
            dispatch(logout());
            toast.success('Logged out successfully');
            navigate('/');
        }, 1500);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <FiLogOut size={40} />
            </div>
            <h2 className="text-3xl font-bold text-indigo-900 mb-2">Logging out...</h2>
            <p className="text-gray-500 max-w-sm">
                Thank you for using Tracking To Do. We're securely signing you out of your session.
            </p>

            <div className="mt-8 flex gap-2">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
            </div>
        </div>
    );
};

export default Logout;
