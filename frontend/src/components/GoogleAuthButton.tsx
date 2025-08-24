'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleAuthButtonProps {
  text?: string;
  className?: string;
}

export default function GoogleAuthButton({ 
  text = "Continue with Google",
  className = "w-full" 
}: GoogleAuthButtonProps) {
  const { updateUser } = useAuth();
  const router = useRouter();

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
      console.log('Initializing Google Auth with Client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
      
      try {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          context: 'signin',
          ux_mode: 'popup',
          error_callback: (error: any) => {
            console.error('Google Auth initialization error:', error);
            toast.error(`Google OAuth error: ${error.type || 'Unknown error'}`);
          }
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            width: 350,
            text: 'continue_with',
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
      console.log('🔍 Google response received:', response);
      
      if (!response.credential) {
        console.error('❌ No credential in Google response');
        throw new Error('No credential received from Google');
      }
      
      console.log('📤 Sending to backend for verification...');
      
      const authResponse = await authApi.googleAuth(response.credential);
      
      console.log('✅ Backend verification successful:', authResponse);

      // Store tokens
      localStorage.setItem('accessToken', authResponse.access);
      localStorage.setItem('refreshToken', authResponse.refresh);

      // Update auth context
      updateUser(authResponse.user);

      toast.success(`Welcome back, ${authResponse.user.username}!`);
      router.push('/dashboard');

    } catch (error: any) {
      console.error('❌ Google auth error:', error);
      
      if (error.message) {
        toast.error(`Authentication failed: ${error.message}`);
      } else {
        toast.error('Google authentication failed. Please try again.');
      }
    }
  };

  return (
    <div className={className}>
      <div 
        id="google-signin-button" 
        className="flex justify-center"
      ></div>
    </div>
  );
}
