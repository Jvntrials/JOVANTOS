
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { AnalysisResultItem } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ResultsTableProps {
  data: AnalysisResultItem[];
}

const bloomColors: { [key: string]: string } = {
  Remembering: 'bg-blue-100 text-blue-800',
  Understanding: 'bg-green-100 text-green-800',
  Applying: 'bg-yellow-100 text-yellow-800',
  Analyzing: 'bg-purple-100 text-purple-800',
  Evaluating: 'bg-red-100 text-red-800',
  Creating: 'bg-pink-100 text-pink-800',
};

export const ResultsTable: React.FC<ResultsTableProps> = ({ data }) => {
    const [copyStatus, setCopyStatus] = useState('Copy as JSON');

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus('Copy as JSON'), 2000);
        }, () => {
            setCopyStatus('Failed to copy');
            setTimeout(() => setCopyStatus('Copy as JSON'), 2000);
        });
    };

    const handleExportExcel = () => {
        const worksheetData = data.map(item => ({
            'Question Number': item.questionNumber,
            'Topic': item.topic,
            'Intended Learning Outcome': item.intendedLearningOutcome,
            "Bloom's Level": item.bloomsLevel,
            'Suggested Item Placement': item.suggestedItemPlacement,
            'Suggested TOS Table Row': item.suggestedTOS_TableRow,
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Analysis');

        // Set column widths for better readability
        const columnWidths = [
            { wch: 15 }, // Question Number
            { wch: 30 }, // Topic
            { wch: 50 }, // Intended Learning Outcome
            { wch: 15 }, // Bloom's Level
            { wch: 50 }, // Suggested Item Placement
            { wch: 40 }, // Suggested TOS Table Row
        ];
        worksheet['!cols'] = columnWidths;

        XLSX.writeFile(workbook, 'Syllabus-Analysis-Report.xlsx');
    };

    if (!data || data.length === 0) {
        return (
            <div className="mt-8 text-center text-slate-500">
                <p>No analysis results to display.</p>
            </div>
        );
    }

  return (
    <div className="mt-8 bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl font-bold text-slate-800">Analysis Results</h2>
        <div className="flex items-center gap-2">
            <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500 transition-colors"
            >
                <ClipboardIcon className="w-4 h-4" />
                {copyStatus}
            </button>
            <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500 transition-colors"
            >
                <DownloadIcon className="w-4 h-4" />
                Export as Excel
            </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Question</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Topic</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Intended Learning Outcome</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Bloom's Level</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Suggestions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.questionNumber}</td>
                <td className="px-6 py-4 whitespace-normal text-sm text-slate-600 max-w-xs">{item.topic}</td>
                <td className="px-6 py-4 whitespace-normal text-sm text-slate-600 max-w-md">{item.intendedLearningOutcome}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${bloomColors[item.bloomsLevel] || 'bg-slate-100 text-slate-800'}`}>
                    {item.bloomsLevel}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-normal text-sm text-slate-600 max-w-sm">
                    <p><strong className="font-semibold text-slate-700">Placement:</strong> {item.suggestedItemPlacement}</p>
                    <p className="mt-1"><strong className="font-semibold text-slate-700">TOS Row:</strong> {item.suggestedTOS_TableRow}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};