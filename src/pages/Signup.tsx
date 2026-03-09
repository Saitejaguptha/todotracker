import React from 'react';
import validator from 'validator';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiUserPlus, FiArrowLeft } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../store/authSlice';
import { loadUserTasks } from '../store/tasksSlice';
import { loadUserActivities } from '../store/activitySlice';
import { type RootState } from '../store';

type SignupFormInputs = {
    name: string;
    email: string;
    gender: 'male' | 'female' | 'other';
    password: string;
    confirmPassword: string;
};

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth);
    const { loading: isLoading, currentUser } = auth;
    const isLoggedIn = !!currentUser;

    const pendingSignupRef = React.useRef(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SignupFormInputs>({
        defaultValues: {
            gender: 'male'
        }
    });

    // Redirect if already logged in
    React.useEffect(() => {
        if (isLoggedIn) {
            navigate('/app/create');
        }
    }, [isLoggedIn, navigate]);

    // React to auth state changes after signup attempt
    React.useEffect(() => {
        if (!pendingSignupRef.current) return;
        if (auth.currentUser) {
            pendingSignupRef.current = false;
            const email = auth.currentUser.email;
            dispatch(loadUserTasks(email));
            dispatch(loadUserActivities(email));
            toast.success('Account created! Welcome, ' + auth.currentUser.name);
            navigate('/app/create');
        } else if (auth.error) {
            pendingSignupRef.current = false;
            toast.error(auth.error, { icon: '⚠️' });
        }
    }, [auth.currentUser, auth.error, navigate]);

    const password = watch('password');

    const onSubmit: SubmitHandler<SignupFormInputs> = (data) => {
        pendingSignupRef.current = true;
        dispatch(signUp({
            name: data.name,
            email: data.email,
            gender: data.gender,
            password: data.password
        }));
    };

    return (
        <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4 md:p-6">
            <div className="w-full max-w-xl bg-white rounded-[2rem] shadow-2xl border border-indigo-100 overflow-hidden relative">
                {/* Accent bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>

                <div className="p-6 md:p-10">
                    <div className="mb-6 md:mb-8 flex items-center justify-between">
                        <Link to="/" className="text-gray-400 hover:text-indigo-600 transition-colors flex items-center gap-1 text-xs md:text-sm font-medium">
                            <FiArrowLeft /> <span className="hidden sm:inline">Back to Login</span><span className="sm:hidden">Login</span>
                        </Link>
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-inner">
                            <FiUserPlus size={20} className="md:size-[24px]" />
                        </div>
                    </div>

                    <div className="text-center mb-8 md:mb-10">
                        <h2 className="text-2xl md:text-3xl font-black text-indigo-900 tracking-tight">Create Account</h2>
                        <p className="text-xs md:text-sm text-gray-500 mt-2">Join Tracking To Do and stay organized</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-indigo-900">
                                    <FiUser className="text-indigo-500" /> Full Name
                                </label>
                                <input
                                    {...register('name', { required: 'Name is required' })}
                                    autoComplete="name"
                                    placeholder="Felix Taskmaster"
                                    className={`w-full px-5 py-3.5 bg-gray-50 border rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-100'
                                        }`}
                                />
                                {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
                            </div>

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
                                    className={`w-full px-5 py-3.5 bg-gray-50 border rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-100'
                                        }`}
                                />
                                {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
                            </div>
                        </div>

                        {/* Gender */}
                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-indigo-900">Gender</label>
                            <div className="flex gap-8">
                                {['male', 'female', 'other'].map((g) => (
                                    <label key={g} className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            {...register('gender')}
                                            type="radio"
                                            value={g}
                                            className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700 capitalize group-hover:text-indigo-600 transition-colors">
                                            {g}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Password */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-indigo-900">
                                    <FiLock className="text-indigo-500" /> Password
                                </label>
                                <input
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: { value: 6, message: 'Min 6 characters' }
                                    })}
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    className={`w-full px-5 py-3.5 bg-gray-50 border rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all ${errors.password ? 'border-red-500' : 'border-gray-100'
                                        }`}
                                />
                                {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-indigo-900">
                                    <FiLock className="text-indigo-500" /> Retype Password
                                </label>
                                <input
                                    {...register('confirmPassword', {
                                        required: 'Please confirm password',
                                        validate: value => value === password || 'Passwords do not match'
                                    })}
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    className={`w-full px-5 py-3.5 bg-gray-50 border rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-gray-100'
                                        }`}
                                />
                                {errors.confirmPassword && <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>}
                            </div>
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
                                    Creating Account...
                                </>
                            ) : (
                                <>Sign Up</>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
