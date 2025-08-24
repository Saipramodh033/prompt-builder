'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { PROMPT_CATEGORIES, RESPONSE_STYLES } from '@/lib/constants';
import { promptsApi } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  ClipboardDocumentIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

export default function BuilderPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const promptId = searchParams.get('id');
  const shouldExecute = searchParams.get('execute') === 'true';
  
  const [formData, setFormData] = useState({
    title: '',
    input_text: '',
    category: user?.preferences?.defaultCategory || '',
    response_style: user?.preferences?.defaultStyle || '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'prompt' | 'response'>('prompt');
  const [isEditing, setIsEditing] = useState(false);

  // Load prompt for editing if ID is provided
  useEffect(() => {
    if (promptId && user) {
      loadPromptForEdit(promptId);
    }
  }, [promptId, user]);

  // Auto-execute if execute parameter is true
  useEffect(() => {
    if (shouldExecute && formData.input_text && formData.category && formData.response_style) {
      handleSubmit();
    }
  }, [shouldExecute, formData.input_text, formData.category, formData.response_style]);

  const loadPromptForEdit = async (id: string) => {
    setLoadingPrompt(true);
    try {
      const prompt = await promptsApi.getPrompt(parseInt(id));
      setFormData({
        title: prompt.title,
        input_text: prompt.input_text,
        category: prompt.category,
        response_style: prompt.response_style,
        description: prompt.description || '',
      });
      
      if (prompt.ai_response) {
        setAiResponse(prompt.ai_response);
      }
      
      setIsEditing(true);
      toast.success('Prompt loaded for editing');
    } catch (error: any) {
      toast.error('Failed to load prompt');
      console.error('Error loading prompt:', error);
    } finally {
      setLoadingPrompt(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!formData.input_text.trim()) {
      toast.error('Please enter your prompt text');
      return;
    }

    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    if (!formData.response_style) {
      toast.error('Please select a response style');
      return;
    }

    setLoading(true);
    setAiResponse('');

    try {
      const response = await promptsApi.executePrompt({
        input_text: formData.input_text,
        category: formData.category as any,
        response_style: formData.response_style as any,
        description: formData.description,
      });

      setGeneratedPrompt(response.generated_prompt || '');
      setAiResponse(response.response || '');
      setActiveTab('response'); // Switch to response tab after execution
      toast.success('Prompt executed successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to execute prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast.success(`${fieldName} copied to clipboard!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const CopyButton = ({ text, fieldName }: { text: string; fieldName: string }) => (
    <button
      onClick={() => copyToClipboard(text, fieldName)}
      className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
      title={`Copy ${fieldName}`}
    >
      {copiedField === fieldName ? (
        <CheckIcon className="h-3 w-3 text-green-600" />
      ) : (
        <ClipboardDocumentIcon className="h-3 w-3 text-gray-600" />
      )}
      <span className="ml-1">Copy</span>
    </button>
  );

  const savePrompt = async () => {
    if (!aiResponse || !generatedPrompt) {
      toast.error('Please execute the prompt first');
      return;
    }

    try {
      const promptData = {
        title: formData.title || `${formData.category} - ${formData.input_text.slice(0, 50)}`,
        input_text: formData.input_text,
        category: formData.category as any,
        response_style: formData.response_style as any,
        description: formData.description,
        ai_response: aiResponse,
      };

      if (isEditing && promptId) {
        // Update existing prompt
        await promptsApi.updatePrompt(parseInt(promptId), promptData);
        toast.success('Prompt updated successfully!');
      } else {
        // Create new prompt
        await promptsApi.createPrompt(promptData);
        toast.success('Prompt saved to your library!');
      }

      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save prompt');
    }
  };

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  if (loadingPrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-dots text-primary-600">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="mt-4 text-gray-600">Loading prompt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Prompt' : 'AI Prompt Builder'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            {isEditing 
              ? 'Modify your existing prompt and re-execute to see updated results' 
              : 'Create personalized AI prompts tailored to your role and preferences'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Input Form */}
          <div className="card">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
              {isEditing ? 'Edit Your Prompt' : 'Build Your Prompt'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="input-field mt-1"
                  placeholder="Enter a title for your prompt"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="input-field mt-1"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {PROMPT_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="response_style" className="block text-sm font-medium text-gray-700">
                  Response Style *
                </label>
                <select
                  id="response_style"
                  name="response_style"
                  required
                  className="input-field mt-1"
                  value={formData.response_style}
                  onChange={handleChange}
                >
                  <option value="">Select a style</option>
                  {RESPONSE_STYLES.map((style) => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="input_text" className="block text-sm font-medium text-gray-700">
                  Your Input *
                </label>
                <textarea
                  id="input_text"
                  name="input_text"
                  required
                  rows={4}
                  className="input-field mt-1"
                  placeholder="Enter your question, idea, or request here..."
                  value={formData.input_text}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Additional Context (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="input-field mt-1"
                  placeholder="Provide any additional context or requirements..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Generating Response...
                  </div>
                ) : (
                  `🚀 ${isEditing ? 'Re-execute' : 'Execute'} Prompt`
                )}
              </button>
            </form>
          </div>

          {/* AI Response */}
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">AI Output</h2>
              {(generatedPrompt || aiResponse) && (
                <button
                  onClick={savePrompt}
                  className="btn-secondary text-sm whitespace-nowrap"
                >
                  💾 {isEditing ? 'Update' : 'Save'} to Library
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Generating your personalized response...</p>
                </div>
              </div>
            ) : (generatedPrompt || aiResponse) ? (
              <div>
                {/* Tab Navigation */}
                <div className="border-b border-gray-200 mb-4">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab('prompt')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'prompt'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      🔧 Generated Prompt
                    </button>
                    <button
                      onClick={() => setActiveTab('response')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'response'
                          ? 'border-green-500 text-green-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      🤖 AI Response
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="min-h-[300px]">
                  {activeTab === 'prompt' && generatedPrompt && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-900">Generated Prompt Template</h3>
                        <CopyButton text={generatedPrompt} fieldName="Generated Prompt" />
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 max-h-96 overflow-y-auto">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{generatedPrompt}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'response' && aiResponse && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-900">AI Response</h3>
                        <CopyButton text={aiResponse} fieldName="AI Response" />
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200 max-h-96 overflow-y-auto">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{aiResponse}</p>
                      </div>
                    </div>
                  )}

                  {/* Show message if current tab has no content */}
                  {activeTab === 'prompt' && !generatedPrompt && (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-4xl mb-2">🔧</div>
                      <p className="text-gray-600">Generated prompt will appear here after execution</p>
                    </div>
                  )}

                  {activeTab === 'response' && !aiResponse && (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-4xl mb-2">🤖</div>
                      <p className="text-gray-600">AI response will appear here after execution</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🚀</div>
                <p className="text-gray-600">
                  Fill out the form and click "Execute Prompt" to see your AI-generated content here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-secondary"
          >
            📊 Go to Dashboard
          </button>
          <button
            onClick={() => {
              if (isEditing) {
                router.push('/dashboard');
              } else {
                setFormData({
                  title: '',
                  input_text: '',
                  category: user?.preferences?.defaultCategory || '',
                  response_style: user?.preferences?.defaultStyle || '',
                  description: '',
                });
                setAiResponse('');
                setGeneratedPrompt('');
                setActiveTab('prompt');
              }
            }}
            className="btn-secondary"
          >
            {isEditing ? '❌ Cancel Edit' : '🔄 Clear Form'}
          </button>
        </div>
      </div>
    </div>
  );
}
