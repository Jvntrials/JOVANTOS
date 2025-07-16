
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

interface HeaderProps {
  isApiKeyMissing: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isApiKeyMissing }) => {
  return (
    <header className="bg-white shadow-md relative">
       {isApiKeyMissing && (
        <div className="bg-yellow-400 text-yellow-900 text-xs text-center p-1.5 font-semibold" role="alert">
          <div className="container mx-auto flex items-center justify-center gap-2 px-4">
            <AlertTriangleIcon className="w-4 h-4 flex-shrink-0" />
            <span>Configuration Required: AI features are disabled. Please set up your API_KEY.</span>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-center text-center">
        <SparklesIcon className="w-8 h-8 text-indigo-500 mr-3" />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
          Syllabus & Exam Analyzer AI
        </h1>
      </div>
    </header>
  );
};
