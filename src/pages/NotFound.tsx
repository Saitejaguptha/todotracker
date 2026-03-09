import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4 md:p-6">
            <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl border border-indigo-100 overflow-hidden relative p-8 md:p-12 text-center">
                {/* Accent bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>

                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <FiAlertCircle size={40} />
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-indigo-900 tracking-tight mb-4">404 - Page Not Found</h2>
                <p className="text-gray-500 mb-10 max-w-sm mx-auto">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>

                <button
                    onClick={() => navigate('/')}
                    className="flex items-center justify-center gap-2 mx-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
                >
                    <FiHome size={20} /> Back to Home
                </button>
            </div>
        </div>
    );
};

export default NotFound;
