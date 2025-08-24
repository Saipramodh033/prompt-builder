'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { promptsApi } from '@/lib/api';
import { Prompt, DashboardStats } from '@/types';
import { PROMPT_CATEGORIES, RESPONSE_STYLES } from '@/lib/constants';
import toast from 'react-hot-toast';
import PromptViewModal from '@/components/PromptViewModal';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingPrompts, setLoadingPrompts] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, fetching data...');
      console.log('Current user:', user);
      fetchPrompts();
      fetchStats();
    } else {
      console.log('User not authenticated');
    }
  }, [isAuthenticated]);

  const fetchPrompts = async () => {
    try {
      const response = await promptsApi.getPrompts();
      setPrompts(response.results);
    } catch (error: any) {
      toast.error('Failed to fetch prompts');
    } finally {
      setLoadingPrompts(false);
    }
  };

  const fetchStats = async () => {
    try {
      console.log('Fetching dashboard stats...');
      const response = await promptsApi.dashboardStats();
      console.log('Dashboard stats response:', response);
      setStats(response);
    } catch (error: any) {
      console.error('Dashboard stats error:', error);
      toast.error(`Failed to fetch dashboard stats: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;

    setDeletingId(id);
    try {
      await promptsApi.deletePrompt(id);
      setPrompts(prompts.filter(p => p.id !== id));
      toast.success('Prompt deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete prompt');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPrompt(null);
  };

  const getCategoryInfo = (category: string) => {
    return PROMPT_CATEGORIES.find(c => c.value === category);
  };

  const getStyleInfo = (style: string) => {
    return RESPONSE_STYLES.find(s => s.value === style);
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
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">📝</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Prompts</p>
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.totalPrompts || 0}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-semibold">⚡</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Executions</p>
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.totalExecutions || 0}</p>
                </div>
              </div>
            </div>

            <div className="card md:col-span-1">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">❤️</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Favorite Category</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900">
                    {stats.favoriteCategory ? getCategoryInfo(stats.favoriteCategory)?.label || stats.favoriteCategory : 'None yet'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Prompts List */}
        <div className="card">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Your Prompts</h2>
            <Link
              href="/builder"
              className="btn-primary w-full sm:w-auto"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create New
            </Link>
          </div>

          {loadingPrompts ? (
            <div className="text-center py-8">
              <div className="loading-dots text-primary-600">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <p className="mt-4 text-gray-600">Loading prompts...</p>
            </div>
          ) : prompts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts yet</h3>
              <p className="text-gray-500 mb-6">Create your first prompt to get started</p>
              <Link href="/builder" className="btn-primary">
                Create Your First Prompt
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {prompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                    <div className="flex-1 w-full lg:w-auto">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 break-words">{prompt.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryInfo(prompt.category)?.color}`}>
                            {getCategoryInfo(prompt.category)?.icon} {getCategoryInfo(prompt.category)?.label}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {getStyleInfo(prompt.response_style)?.icon} {getStyleInfo(prompt.response_style)?.label}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2 line-clamp-2 text-sm sm:text-base break-words">{prompt.input_text}</p>
                      {prompt.description && (
                        <p className="text-sm text-gray-500 mb-2 break-words">{prompt.description}</p>
                      )}
                      <p className="text-sm text-gray-400">
                        Created: {new Date(prompt.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-row lg:flex-col xl:flex-row gap-2 w-full lg:w-auto justify-end">
                      <button
                        onClick={() => handleViewPrompt(prompt)}
                        className="flex-1 lg:flex-none p-2 text-gray-400 hover:text-primary-600 transition-colors rounded-md hover:bg-gray-50"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5 mx-auto" />
                      </button>
                      <Link
                        href={`/builder?id=${prompt.id}`}
                        className="flex-1 lg:flex-none p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-md hover:bg-gray-50"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5 mx-auto" />
                      </Link>
                      <Link
                        href={`/builder?id=${prompt.id}&execute=true`}
                        className="flex-1 lg:flex-none p-2 text-gray-400 hover:text-green-600 transition-colors rounded-md hover:bg-gray-50"
                        title="Execute"
                      >
                        <PlayIcon className="h-5 w-5 mx-auto" />
                      </Link>
                      <button
                        onClick={() => handleDelete(prompt.id)}
                        disabled={deletingId === prompt.id}
                        className="flex-1 lg:flex-none p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 rounded-md hover:bg-gray-50"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5 mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Prompt View Modal */}
      {selectedPrompt && (
        <PromptViewModal
          prompt={selectedPrompt}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
