'use client';

import { useState } from 'react';
import { Prompt } from '@/types';
import { PROMPT_CATEGORIES, RESPONSE_STYLES } from '@/lib/constants';
import toast from 'react-hot-toast';
import {
  XMarkIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

interface PromptViewModalProps {
  prompt: Prompt;
  isOpen: boolean;
  onClose: () => void;
}

export default function PromptViewModal({ prompt, isOpen, onClose }: PromptViewModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const getCategoryInfo = (category: string) => {
    return PROMPT_CATEGORIES.find(c => c.value === category);
  };

  const getStyleInfo = (style: string) => {
    return RESPONSE_STYLES.find(s => s.value === style);
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="w-full">
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                  {prompt.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryInfo(prompt.category)?.color}`}>
                    {getCategoryInfo(prompt.category)?.icon} {getCategoryInfo(prompt.category)?.label}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {getStyleInfo(prompt.response_style)?.icon} {getStyleInfo(prompt.response_style)?.label}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Created: {new Date(prompt.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                {/* Input Text */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">Original Input</h4>
                    <CopyButton text={prompt.input_text} fieldName="Input" />
                  </div>
                  <div className="bg-gray-50 rounded-md p-4 border">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{prompt.input_text}</p>
                  </div>
                </div>

                {/* Description */}
                {prompt.description && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">Additional Context</h4>
                      <CopyButton text={prompt.description} fieldName="Context" />
                    </div>
                    <div className="bg-gray-50 rounded-md p-4 border">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{prompt.description}</p>
                    </div>
                  </div>
                )}

                {/* Generated Prompt */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">Generated Prompt</h4>
                    <CopyButton text={prompt.generated_prompt} fieldName="Prompt" />
                  </div>
                  <div className="bg-blue-50 rounded-md p-4 border border-blue-200">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{prompt.generated_prompt}</p>
                  </div>
                </div>

                {/* AI Response */}
                {prompt.ai_response && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">AI Response</h4>
                      <CopyButton text={prompt.ai_response} fieldName="Response" />
                    </div>
                    <div className="bg-green-50 rounded-md p-4 border border-green-200">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{prompt.ai_response}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onClose}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    const fullText = `Title: ${prompt.title}\n\nCategory: ${getCategoryInfo(prompt.category)?.label}\nStyle: ${getStyleInfo(prompt.response_style)?.label}\n\nInput: ${prompt.input_text}\n\n${prompt.description ? `Context: ${prompt.description}\n\n` : ''}Generated Prompt: ${prompt.generated_prompt}\n\n${prompt.ai_response ? `AI Response: ${prompt.ai_response}` : ''}`;
                    copyToClipboard(fullText, 'Full prompt');
                  }}
                >
                  📋 Copy All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
