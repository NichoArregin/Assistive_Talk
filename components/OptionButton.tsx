import React from 'react';
import type { Option } from '../types';
import Icon from './Icon';

interface OptionButtonProps {
  option: Option;
  onClick: () => void;
  onDelete?: () => void;
}

const OptionButton: React.FC<OptionButtonProps> = ({ option, onClick, onDelete }) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };
  
  const formattedDate = new Date(option.date + 'T00:00:00').toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center justify-center p-4 bg-slate-700 rounded-lg border-2 border-transparent hover:bg-slate-600 hover:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-200 aspect-square"
      aria-label={option.label}
    >
      {onDelete && (
        <button
          onClick={handleDeleteClick}
          className="absolute top-1 right-1 p-1 bg-slate-800/50 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white focus:opacity-100 focus:bg-red-500 focus:text-white transition-all duration-200 z-10"
          aria-label={`Delete ${option.label}`}
        >
          <Icon name="close" className="w-4 h-4" />
        </button>
      )}
      <div className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400 mb-2">
        <Icon name={option.icon} />
      </div>
      <span className="text-center font-semibold text-sm sm:text-base text-gray-200">{option.label}</span>
      <div className="text-center text-xs text-gray-400 mt-1">
        <span>{formattedDate}</span>
        {option.time && <span className="ml-1 font-mono">{formatTime(option.time)}</span>}
      </div>
    </button>
  );
};

export default OptionButton;
