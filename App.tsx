
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ResultsTable } from './components/ResultsTable';
import { Loader } from './components/Loader';
import { analyzeSyllabusAndExam } from './services/geminiService';
import { AnalysisResultItem } from './types';
import { SYLLABUS_PLACEHOLDER, EXAM_PLACEHOLDER } from './constants';

const App: React.FC = () => {
  const [syllabus, setSyllabus] = useState<string>('');
  const [exam, setExam] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultItem[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState<boolean>(false);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setIsApiKeyMissing(true);
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!syllabus.trim() || !exam.trim()) {
      setError('Please provide both syllabus and exam content.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeSyllabusAndExam(syllabus, exam);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please check the console.');
    } finally {
      setIsLoading(false);
    }
  }, [syllabus, exam]);

  const handleUseSampleData = () => {
    setSyllabus(SYLLABUS_PLACEHOLDER);
    setExam(EXAM_PLACEHOLDER);
    setError(null);
  };
  
  const handleClear = () => {
    setSyllabus('');
    setExam('');
    setAnalysisResult(null);
    setError(null);
  };


  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Header isApiKeyMissing={isApiKeyMissing} />
      <main className="container mx-auto p-4 md:p-8">
        <InputSection
          syllabus={syllabus}
          setSyllabus={setSyllabus}
          exam={exam}
          setExam={setExam}
          onAnalyze={handleAnalyze}
          onUseSampleData={handleUseSampleData}
          onClear={handleClear}
          isLoading={isLoading}
          isApiKeyMissing={isApiKeyMissing}
        />
        
        {isLoading && <Loader />}
        
        {error && (
          <div className="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {analysisResult && <ResultsTable data={analysisResult} />}
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        <p>Powered by Google Gemini. Designed by a World-Class React Engineer.</p>
      </footer>
    </div>
  );
};

export default App;
