import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiSave, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store';
import { updateProfile } from '../store/authSlice';

type ProfileFormInputs = {
    name: string;
    email: string;
    gender: 'male' | 'female' | 'other';
    newPassword?: string;
    confirmNewPassword?: string;
};

const Profile: React.FC = () => {
    const auth = useSelector((state: RootState) => state.auth);
    const user = auth.currentUser || { id: '', name: 'Guest', email: '', gender: 'other' as const };
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    // const isLoading = auth.loading;

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<ProfileFormInputs>({
        defaultValues: {
            name: user.name,
            email: user.email,
            gender: user.gender,
        },
    });

    const newPassword = watch('newPassword');

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel editing
            setIsEditing(false);
            setIsChangingPassword(false);
            reset({
                name: user.name,
                email: user.email,
                gender: user.gender
            });
        } else {
            setIsEditing(true);
        }
    };

    const onSubmit: SubmitHandler<ProfileFormInputs> = (data) => {
        const updateData: any = {
            id: user.id,
            name: data.name,
            email: data.email,
            gender: data.gender
        };

        if (isChangingPassword && data.newPassword) {
            updateData.password = data.newPassword;
        }

        dispatch(updateProfile(updateData));
        toast.success('Profile details updated successfully!');
        setIsEditing(false);
        setIsChangingPassword(false);
    };

    return (
        <div className="w-full max-w-2xl mx-auto px-4 md:px-6 py-4 md:py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 pb-4 border-b border-indigo-100">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-indigo-900 tracking-tight">User Profile</h2>
                    <p className="text-xs md:text-sm text-gray-500 font-medium">View and manage your personal information</p>
                </div>
                <button
                    onClick={handleEditToggle}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm text-sm sm:w-auto w-full ${isEditing
                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                >
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <FiEdit2 size={16} /> Edit Profile Details
                        </>
                    )}
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl border border-indigo-100 shadow-xl relative overflow-hidden">
                {/* Dynamic Background Element */}
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-indigo-900">
                            <FiUser className="text-indigo-500" /> Full Name
                        </label>
                        <input
                            {...register('name', { required: 'Name is required' })}
                            disabled={!isEditing}
                            autoComplete="name"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-indigo-900">
                            <FiMail className="text-indigo-500" /> Email Address
                        </label>
                        <input
                            {...register('email', {
                                required: 'Email is required',
                                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                            })}
                            disabled={!isEditing}
                            type="email"
                            autoComplete="email"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                        />
                        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    {/* Gender */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-semibold text-indigo-900 mb-2">Gender</label>
                        <div className="flex gap-6">
                            {['male', 'female', 'other'].map((g) => (
                                <label key={g} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        {...register('gender')}
                                        type="radio"
                                        value={g}
                                        disabled={!isEditing}
                                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 disabled:opacity-50"
                                    />
                                    <span className="text-sm text-gray-700 capitalize group-hover:text-indigo-600 transition-colors">
                                        {g}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Password Management */}
                    <div className="md:col-span-2 space-y-4 pt-4 border-t border-indigo-50">
                        {!isChangingPassword ? (
                            <button
                                type="button"
                                disabled={!isEditing}
                                onClick={() => setIsChangingPassword(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-indigo-100"
                            >
                                <FiLock /> Create New Password
                            </button>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-indigo-900">
                                        <FiLock className="text-indigo-500" /> New Password
                                    </label>
                                    <input
                                        {...register('newPassword', {
                                            required: isChangingPassword ? 'New password is required' : false,
                                            minLength: { value: 6, message: 'Minimum 6 characters' }
                                        })}
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    />
                                    {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-indigo-900">
                                        <FiLock className="text-indigo-500" /> Re-type New Password
                                    </label>
                                    <input
                                        {...register('confirmNewPassword', {
                                            required: isChangingPassword ? 'Please confirm your password' : false,
                                            validate: value => value === newPassword || 'Passwords do not match'
                                        })}
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    />
                                    {errors.confirmNewPassword && <p className="text-xs text-red-500">{errors.confirmNewPassword.message}</p>}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsChangingPassword(false)}
                                    className="text-xs text-indigo-500 font-bold hover:underline w-fit"
                                >
                                    Cancel password change
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button (Only visible when editing) */}
                {isEditing && (
                    <div className="pt-6 border-t border-indigo-50 flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all"
                        >
                            <FiSave /> Save Changes
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Profile;
