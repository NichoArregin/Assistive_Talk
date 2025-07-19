import React from 'react';
import type { Mood, MoodEntry } from '../types';
import Icon from './Icon';

interface MoodTrackerProps {
  moodHistory: MoodEntry[];
  onAddMood: (mood: Mood) => void;
}

const moodMeta: Record<Mood, { icon: string; label: string; color: string }> = {
  happy: { icon: 'moodHappy', label: 'Happy', color: 'text-green-400' },
  content: { icon: 'moodContent', label: 'Content', color: 'text-sky-400' },
  sad: { icon: 'moodSad', label: 'Sad', color: 'text-yellow-400' },
  upset: { icon: 'moodUpset', label: 'Upset', color: 'text-red-400' },
};

const MoodTracker: React.FC<MoodTrackerProps> = ({ moodHistory, onAddMood }) => {
  const latestMood = moodHistory?.[0];

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
      <h3 className="text-2xl font-semibold text-gray-200 mb-4">How are you feeling?</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Mood Input */}
        <div className="md:col-span-1 bg-slate-700/50 p-4 rounded-lg">
          <p className="text-center font-semibold text-gray-300 mb-3">Log a new mood</p>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(moodMeta) as Mood[]).map((mood) => (
              <button
                key={mood}
                onClick={() => onAddMood(mood)}
                className={`group flex flex-col items-center justify-center p-3 rounded-lg border-2 border-transparent hover:bg-slate-600 hover:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-200 aspect-square`}
                aria-label={moodMeta[mood].label}
              >
                <div className={`w-12 h-12 ${moodMeta[mood].color}`}>
                  <Icon name={moodMeta[mood].icon} />
                </div>
                <span className="text-sm font-semibold mt-2 text-gray-300">{moodMeta[mood].label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mood History */}
        <div className="md:col-span-2 bg-slate-700/50 p-4 rounded-lg">
           <h4 className="font-semibold text-gray-300 mb-3">Recent moods</h4>
           {latestMood ? (
            <div className="space-y-3">
              <div className="bg-slate-900/50 p-3 rounded-lg flex items-center gap-4">
                  <div className={`w-10 h-10 ${moodMeta[latestMood.mood].color}`}>
                    <Icon name={moodMeta[latestMood.mood].icon} />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-100">{moodMeta[latestMood.mood].label}</p>
                    <p className="text-sm text-gray-400">Latest mood, logged {formatRelativeTime(latestMood.timestamp)}</p>
                  </div>
              </div>
              <ul className="space-y-2">
                {moodHistory.slice(1).map(entry => (
                  <li key={entry.id} className="flex items-center gap-3 p-2 bg-slate-800/60 rounded-md">
                    <div className={`w-6 h-6 flex-shrink-0 ${moodMeta[entry.mood].color}`}>
                      <Icon name={moodMeta[entry.mood].icon} />
                    </div>
                    <span className="text-sm font-medium text-gray-300 flex-grow">{moodMeta[entry.mood].label}</span>
                    <span className="text-xs text-gray-500">{formatRelativeTime(entry.timestamp)}</span>
                  </li>
                ))}
              </ul>
            </div>
           ) : (
             <p className="text-center text-gray-400 py-8">No moods logged yet.</p>
           )}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
