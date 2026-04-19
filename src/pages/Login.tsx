import React from 'react';
import validator from 'validator';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { signInUser } from '../store/authSlice';
import { fetchTasks } from '../store/tasksSlice';
import { loadUserActivities } from '../store/activitySlice';
import { type RootState, type AppDispatch } from '../store';

type LoginFormInputs = {
    email: string;
    password: string;
};

const Login: React.FC = () => {
    const navigate = useNavigate();
    const auth = useSelector((state: RootState) => state.auth);
    const { loading: isLoading, currentUser } = auth;
    const isLoggedIn = !!currentUser;
    const dispatch = useDispatch<AppDispatch>();
    const pendingLoginRef = React.useRef(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>();

    // Redirect if already logged in
    React.useEffect(() => {
        if (isLoggedIn) {
            navigate('/app/create');
        }
    }, [isLoggedIn, navigate]);

    // React to auth state changes after a login attempt
    React.useEffect(() => {
        if (!pendingLoginRef.current) return;
        if (auth.currentUser) {
            pendingLoginRef.current = false;
            const userId = auth.currentUser.id;
            const email = auth.currentUser.email;
            dispatch(fetchTasks(userId));
            dispatch(loadUserActivities(email));
            toast.success(`Welcome back, ${auth.currentUser.name}!`);
            navigate('/app/create');
        } else if (auth.error) {
            pendingLoginRef.current = false;
            toast.error(auth.error, { icon: '🔒' });
        }
    }, [auth.currentUser, auth.error, navigate, dispatch]);

    const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
        pendingLoginRef.current = true;
        dispatch(signInUser(data));
    };

    return (
        <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4 md:p-6">
            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-indigo-100 overflow-hidden relative">
                {/* Accent bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>

                <div className="p-6 md:p-10">
                    <div className="text-center mb-8 md:mb-10">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                            <FiLogIn size={28} className="md:size-[32px]" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-indigo-900 tracking-tight">Tracking To Do</h2>
                        <p className="text-xs md:text-sm text-gray-500 mt-2">Sign in to manage your tasks</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-indigo-900">
                                <FiMail className="text-indigo-500" /> Email Address
                            </label>
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    validate: value => validator.isEmail(value) || 'Invalid email address'
                                })}
                                type="email"
                                autoComplete="email"
                                placeholder="felix@example.com"
                                className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-100'
                                    }`}
                            />
                            {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-indigo-900">
                                <FiLock className="text-indigo-500" /> Password
                            </label>
                            <input
                                {...register('password', { required: 'Password is required' })}
                                type="password"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all ${errors.password ? 'border-red-500' : 'border-gray-100'
                                    }`}
                            />
                            {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 ${isLoading
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Signing in...
                                </>
                            ) : (
                                <>Sign In</>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account? <Link to="/signup" className="text-indigo-600 font-bold cursor-pointer hover:underline">Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
