import React, { useState } from 'react';
import type { DiaryEntry } from '../types';
import Icon from './Icon';

interface DiaryProps {
  diaryEntries: DiaryEntry[];
  onAddDiaryEntry: (content: string) => void;
}

const Diary: React.FC<DiaryProps> = ({ diaryEntries, onAddDiaryEntry }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAddDiaryEntry(content.trim());
      setContent('');
    }
  };
  
  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return then.toLocaleDateString();
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg mb-8">
      <h3 className="text-2xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
        <Icon name="diary" className="w-6 h-6"/>
        <span>Diary</span>
      </h3>
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a new diary entry..."
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          rows={3}
          aria-label="New diary entry"
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 transition disabled:bg-slate-600 disabled:cursor-not-allowed"
            disabled={!content.trim()}
          >
            Save Entry
          </button>
        </div>
      </form>
      
      <div>
        <h4 className="font-semibold text-gray-300 mb-3">Recent Entries</h4>
        {diaryEntries.length > 0 ? (
          <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
            {diaryEntries.map(entry => (
              <div key={entry.id} className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-gray-200 whitespace-pre-wrap">{entry.content}</p>
                <p className="text-right text-xs text-gray-500 mt-2">{formatRelativeTime(entry.timestamp)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-6">No diary entries yet.</p>
        )}
      </div>
    </div>
  );
};

export default Diary;