'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { USER_ROLES } from '@/lib/constants';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleAuthRegisterButtonProps {
  text?: string;
  className?: string;
}

export default function GoogleAuthRegisterButton({ 
  text = "Sign up with Google",
  className = "w-full" 
}: GoogleAuthRegisterButtonProps) {
  const { updateUser } = useAuth();
  const router = useRouter();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [tempUserData, setTempUserData] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleAuth;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeGoogleAuth = () => {
    if (window.google) {
      console.log('Initializing Google Auth for Registration with Client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
      
      try {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          context: 'signup',
          ux_mode: 'popup',
          error_callback: (error: any) => {
            console.error('Google Auth initialization error:', error);
            toast.error(`Google OAuth error: ${error.type || 'Unknown error'}`);
          }
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signup-button'),
          {
            theme: 'outline',
            size: 'large',
            width: 350,
            text: 'signup_with',
            shape: 'rectangular',
          }
        );
      } catch (error) {
        console.error('Failed to initialize Google Auth:', error);
        toast.error('Failed to initialize Google Sign-in');
      }
    } else {
      console.error('Google Identity Services not loaded');
      toast.error('Google Sign-in service not available');
    }
  };

  const handleGoogleResponse = async (response: any) => {
    try {
      console.log('🔍 Google signup response received:', response);
      
      if (!response.credential) {
        throw new Error('No credential received from Google');
      }
      
      console.log('📤 Sending to backend for verification...');
      
      const authResponse = await authApi.googleAuth(response.credential);
      
      console.log('✅ Backend verification successful:', authResponse);
      
      // Check if this is a new user (created via Google OAuth)
      // If the user was just created, they won't have a role set
      if (!authResponse.user.role || authResponse.user.role === '') {
        // Show role selection modal
        setTempUserData(authResponse);
        setShowRoleModal(true);
      } else {
        // User already exists and has a role, proceed with login
        completeAuthentication(authResponse);
      }

    } catch (error: any) {
      console.error('❌ Google authentication error:', error);
      toast.error(`Failed to sign up with Google: ${error.message || 'Please try again'}`);
    }
  };

  const completeRegistration = async () => {
    if (!selectedRole || !tempUserData) {
      toast.error('Please select a role');
      return;
    }

    try {
      // Store tokens first so API calls work
      localStorage.setItem('accessToken', tempUserData.access);
      localStorage.setItem('refreshToken', tempUserData.refresh);

      // Update user with selected role
      const updatedUser = await authApi.updateProfile({ role: selectedRole });
      
      // Complete authentication with updated user data
      completeAuthentication({
        ...tempUserData,
        user: updatedUser
      });

    } catch (error: any) {
      console.error('❌ Error updating user role:', error);
      toast.error('Failed to complete registration');
      // Clean up tokens on error
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  const completeAuthentication = (data: any) => {
    // Store tokens and user data
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);

    // Update auth context
    updateUser(data.user);
    
    setShowRoleModal(false);
    toast.success(`Welcome to Prompt Builder, ${data.user.username}!`);
    router.push('/dashboard');
  };

  return (
    <>
      <div className={className}>
        <div 
          id="google-signup-button" 
          className="flex justify-center"
        ></div>
      </div>

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowRoleModal(false)}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Complete Your Registration
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Please select your role to complete the registration process.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="role-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Your Role
                </label>
                <select
                  id="role-select"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                >
                  <option value="">Choose your role</option>
                  {USER_ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm order-2 sm:order-1"
                  onClick={completeRegistration}
                  disabled={!selectedRole}
                >
                  Complete Registration
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm order-1 sm:order-2"
                  onClick={() => setShowRoleModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
