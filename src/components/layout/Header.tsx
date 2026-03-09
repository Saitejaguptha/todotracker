import React from 'react';
import { Link } from 'react-router-dom';
import { FiSettings, FiMenu } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../store';
import { getAvatarUrl } from '../../utils/avatarUtils';
import { toggleSidebar } from '../../store/uiSlice';

const Header: React.FC = () => {
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth);
    const user = auth.currentUser || { name: 'Guest', gender: 'other' as const };

    return (
        <header className="h-[60px] bg-white flex items-center justify-between px-4 md:px-6 border-b border-indigo-100 shrink-0 shadow-sm z-50 sticky top-0">
            <div className="flex-1 flex items-center gap-4">
                <button
                    onClick={() => dispatch(toggleSidebar())}
                    className="p-2 -ml-2 text-indigo-600 hover:bg-indigo-50 rounded-lg lg:hidden transition-colors"
                >
                    <FiMenu size={24} />
                </button>
                <Link to="/app/create" className="hover:opacity-80 transition-opacity truncate">
                    <h1 className="text-lg md:text-xl font-bold text-indigo-900 tracking-tight">Tracking To Do</h1>
                </Link>
            </div>

            <div className="hidden sm:flex flex-[2] max-w-[600px] items-center justify-center px-4">
                <div className="bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100 flex items-center gap-2 truncate">
                    <span className="text-indigo-400 text-sm font-medium">✨</span>
                    <span className="text-indigo-900 font-bold text-sm tracking-wide truncate">
                        Welcome, <span className="text-indigo-600">{user.name}</span>
                    </span>
                </div>
            </div>

            <div className="flex-1 flex justify-end items-center gap-2 md:gap-4">
                <Link
                    to="/app/settings"
                    className="text-gray-400 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-indigo-50"
                    title="Settings"
                >
                    <FiSettings size={22} />
                </Link>

                <Link
                    to="/app/profile"
                    className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 cursor-pointer hover:ring-2 ring-indigo-300 ring-offset-2 transition-all border border-indigo-200 overflow-hidden shadow-sm shrink-0"
                    title="Profile"
                >
                    <img src={getAvatarUrl(user.gender, user.name)} alt="Profile" className="w-full h-full object-cover" />
                </Link>
            </div>
        </header>
    );
};

export default Header;
