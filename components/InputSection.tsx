
import React from 'react';

interface InputSectionProps {
  syllabus: string;
  setSyllabus: (value: string) => void;
  exam: string;
  setExam: (value: string) => void;
  onAnalyze: () => void;
  onUseSampleData: () => void;
  onClear: () => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({
  syllabus,
  setSyllabus,
  exam,
  setExam,
  onAnalyze,
  onUseSampleData,
  onClear,
  isLoading,
}) => {
  const commonTextareaClasses = "w-full h-80 p-4 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-y bg-slate-50";

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="syllabus" className="block text-lg font-semibold mb-2 text-slate-700">
            Syllabus Content
          </label>
          <textarea
            id="syllabus"
            value={syllabus}
            onChange={(e) => setSyllabus(e.target.value)}
            placeholder="Paste your syllabus here, especially the Intended Learning Outcomes (ILOs)..."
            className={commonTextareaClasses}
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="exam" className="block text-lg font-semibold mb-2 text-slate-700">
            Exam Content
          </label>
          <textarea
            id="exam"
            value={exam}
            onChange={(e) => setExam(e.target.value)}
            placeholder="Paste your exam questions here..."
            className={commonTextareaClasses}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-2">
            <button
            onClick={onUseSampleData}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 border border-transparent rounded-md hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
            Load Sample Data
            </button>
             <button
            onClick={onClear}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 border border-transparent rounded-md hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
            Clear
            </button>
        </div>

        <button
          onClick={onAnalyze}
          disabled={isLoading || !syllabus.trim() || !exam.trim()}
          className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Content'}
        </button>
      </div>
    </div>
  );
};
