import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FiPlusCircle,
    FiEdit,
    FiClock,
    FiCheckCircle,
    FiList,
    FiActivity,
    FiLogOut,
    FiTrash2,
    FiX
} from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { setSidebarOpen } from '../../store/uiSlice';

const SidebarItem = ({ icon: Icon, text, to }: { icon: any, text: string, to: string }) => {
    const dispatch = useDispatch();
    return (
        <NavLink
            to={to}
            onClick={() => dispatch(setSidebarOpen(false))}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-l-4 ${isActive
                ? 'bg-indigo-600 text-white font-medium border-indigo-900'
                : 'text-indigo-900 hover:bg-indigo-100/80 border-transparent'
                }`}
        >
            {({ isActive }) => (
                <>
                    <Icon size={20} className={isActive ? 'text-white' : 'text-indigo-500'} />
                    <span className="text-[15px]">{text}</span>
                </>
            )}
        </NavLink>
    );
};

const Sidebar: React.FC = () => {
    const dispatch = useDispatch();

    return (
        <aside className="w-[260px] bg-indigo-50/80 flex flex-col h-full border-r border-indigo-100 shrink-0">
            {/* Mobile Close Button */}
            <div className="lg:hidden p-4 border-b border-indigo-100 flex items-center justify-between">
                <span className="font-bold text-indigo-900">Menu</span>
                <button
                    onClick={() => dispatch(setSidebarOpen(false))}
                    className="p-2 -mr-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                    <FiX size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1">
                <SidebarItem icon={FiPlusCircle} text="Create Task" to="/app/create" />
                <SidebarItem icon={FiEdit} text="Edit Task" to="/app/edit" />
                <SidebarItem icon={FiClock} text="Pending Tasks" to="/app/pending" />
                <SidebarItem icon={FiCheckCircle} text="Recently Completed Tasks" to="/app/completed" />
                <SidebarItem icon={FiList} text="All Tasks" to="/app/all" />
                <SidebarItem icon={FiTrash2} text="Delete Task" to="/app/delete" />
                <SidebarItem icon={FiActivity} text="Recent Activity" to="/app/activity" />
            </div>

            <div className="p-4 border-t border-indigo-100">
                <SidebarItem icon={FiLogOut} text="Logout" to="/app/logout" />
            </div>
        </aside>
    );
};

export default Sidebar;
