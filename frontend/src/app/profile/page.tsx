'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { USER_ROLES, PROMPT_CATEGORIES, RESPONSE_STYLES } from '@/lib/constants';
import toast from 'react-hot-toast';
import {
  UserCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { user, updateUser, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    role: '',
    preferences: {
      defaultCategory: '',
      defaultStyle: '',
    },
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        role: user.role,
        preferences: {
          defaultCategory: user.preferences.defaultCategory || '',
          defaultStyle: user.preferences.defaultStyle || '',
        },
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedUser = await authApi.updateProfile(formData);
      updateUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        email: user.email,
        role: user.role,
        preferences: {
          defaultCategory: user.preferences.defaultCategory || '',
          defaultStyle: user.preferences.defaultStyle || '',
        },
      });
    }
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setFormData({
        ...formData,
        preferences: {
          ...formData.preferences,
          [prefKey]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-dots text-primary-600">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <UserCircleIcon className="h-12 w-12 text-gray-400 mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-gray-600">Manage your account and preferences</p>
              </div>
            </div>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary flex items-center"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex items-center"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <CheckIcon className="h-4 w-4 mr-2" />
                  )}
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="btn-secondary flex items-center"
                >
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Profile Form */}
          <div className="space-y-6">
            {/* Username (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={user?.username || ''}
                disabled
                className="input-field bg-gray-50 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">Username cannot be changed</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`input-field ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={!isEditing}
                className={`input-field ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              >
                {USER_ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferences */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Default Preferences</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Default Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Category
                  </label>
                  <select
                    name="preferences.defaultCategory"
                    value={formData.preferences.defaultCategory || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="">No default</option>
                    {PROMPT_CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Default Style */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Style
                  </label>
                  <select
                    name="preferences.defaultStyle"
                    value={formData.preferences.defaultStyle || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="">No default</option>
                    {RESPONSE_STYLES.map((style) => (
                      <option key={style.value} value={style.value}>
                        {style.icon} {style.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Member since:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Account ID:</span>
                  <span className="text-sm font-medium text-gray-900">#{user?.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
