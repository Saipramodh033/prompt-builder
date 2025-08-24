'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
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
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="relative z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <span className="text-xl sm:text-2xl font-bold text-primary-600">
                🚀 Prompt Builder
              </span>
            </div>
            <div className="flex items-center justify-end space-x-4 md:flex-1 lg:w-0">
              <Link
                href="/auth/login"
                className="whitespace-nowrap text-sm sm:text-base font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="btn-primary text-sm sm:text-base"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12 sm:py-20">
          <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl animate-fade-in">
            <span className="block">Build Powerful</span>
            <span className="block text-primary-600">AI Prompts</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl animate-fade-in">
            Create, manage, and execute AI prompts with ease. Generate personalized prompts for various use cases and connect with Google Gemini for instant results.
          </p>
          <div className="mt-5 max-w-md mx-auto flex flex-col sm:flex-row sm:justify-center gap-3 md:mt-8 animate-slide-up">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto flex items-center justify-center px-6 sm:px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition-all duration-200 transform hover:scale-105"
            >
              Start Building
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto flex items-center justify-center px-6 sm:px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12 sm:py-20">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-4xl">
              Everything you need to build amazing prompts
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray-500">
              Powerful features designed to make prompt engineering accessible and effective.
            </p>
          </div>

          <div className="mt-12 sm:mt-20">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
              <div className="card text-center transform hover:scale-105 transition-transform duration-200">
                <div className="text-3xl sm:text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-medium text-gray-900">Smart Categories</h3>
                <p className="mt-2 text-sm sm:text-base text-gray-500">
                  Choose from specialized categories like image generation, learning roadmaps, and deep research.
                </p>
              </div>

              <div className="card text-center transform hover:scale-105 transition-transform duration-200">
                <div className="text-3xl sm:text-4xl mb-4">🎨</div>
                <h3 className="text-lg font-medium text-gray-900">Response Styles</h3>
                <p className="mt-2 text-sm sm:text-base text-gray-500">
                  Customize the tone and format with styles like concise, detailed, creative, formal, or technical.
                </p>
              </div>

              <div className="card text-center transform hover:scale-105 transition-transform duration-200">
                <div className="text-3xl sm:text-4xl mb-4">👤</div>
                <h3 className="text-lg font-medium text-gray-900">Personalized</h3>
                <p className="mt-2 text-sm sm:text-base text-gray-500">
                  Prompts are tailored to your role and preferences for more relevant results.
                </p>
              </div>

              <div className="card text-center transform hover:scale-105 transition-transform duration-200">
                <div className="text-3xl sm:text-4xl mb-4">⚡</div>
                <h3 className="text-lg font-medium text-gray-900">Instant Execution</h3>
                <p className="mt-2 text-sm sm:text-base text-gray-500">
                  Execute prompts directly with Google Gemini integration for immediate AI responses.
                </p>
              </div>

              <div className="card text-center transform hover:scale-105 transition-transform duration-200">
                <div className="text-3xl sm:text-4xl mb-4">💾</div>
                <h3 className="text-lg font-medium text-gray-900">Save & Reuse</h3>
                <p className="mt-2 text-sm sm:text-base text-gray-500">
                  Save your favorite prompts and build a personal library for future use.
                </p>
              </div>

              <div className="card text-center transform hover:scale-105 transition-transform duration-200">
                <div className="text-3xl sm:text-4xl mb-4">📊</div>
                <h3 className="text-lg font-medium text-gray-900">Dashboard</h3>
                <p className="mt-2 text-sm sm:text-base text-gray-500">
                  Manage all your prompts in one place with editing, organization, and analytics.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary-50 rounded-2xl px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Ready to supercharge your AI interactions?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600">
              Join thousands of users who are already building better prompts.
            </p>
            <div className="mt-6 sm:mt-8">
              <Link
                href="/auth/register"
                className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 transform hover:scale-105 transition-all duration-200"
              >
                Get Started for Free
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 sm:mt-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm sm:text-base text-gray-400">
              © 2024 Prompt Builder. Built with ❤️ for better AI interactions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
