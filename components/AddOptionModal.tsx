import React, { useState, useMemo, useEffect } from 'react';
import type { DefaultOption } from '../types';
import Icon from './Icon';

interface AddOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOption: (label: string, icon: string, date: string, time: string) => void;
  defaultOptions: DefaultOption[];
  title: string;
}

const AddOptionModal: React.FC<AddOptionModalProps> = ({ isOpen, onClose, onAddOption, defaultOptions, title }) => {
  const [activeTab, setActiveTab] = useState<'library' | 'custom'>('library');
  const [searchTerm, setSearchTerm] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  });

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setActiveTab('library');
      setSearchTerm('');
      setCustomLabel('');
      setDate(new Date().toISOString().split('T')[0]);
      const now = new Date();
      setTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    }
  }, [isOpen]);

  const filteredLibraryOptions = useMemo(() => {
    return defaultOptions.filter(opt =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [defaultOptions, searchTerm]);

  const handleLibraryOptionClick = (option: DefaultOption) => {
    onAddOption(option.label, option.icon, date, time);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLabel.trim()) {
      onAddOption(customLabel.trim(), 'custom', date, time);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl flex flex-col"
        style={{ height: 'calc(100vh - 4rem)'}}
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-100">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700">
            <Icon name="close" className="w-6 h-6 text-gray-400" />
          </button>
        </header>

        <div className="p-4 border-b border-slate-700 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('library')}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'library' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-600/50'}`}
              >
                Library
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'custom' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-600/50'}`}
              >
                Custom
              </button>
            </div>
             <div className="flex items-center gap-2">
                 <label htmlFor="optionDate" className="text-sm font-medium text-gray-300">Date:</label>
                 <input
                    id="optionDate"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                    required
                />
                 <label htmlFor="optionTime" className="text-sm font-medium text-gray-300">Time:</label>
                 <input
                    id="optionTime"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                    required
                />
            </div>
          </div>
        </div>

        <main className="flex-grow overflow-y-auto p-4">
          {activeTab === 'library' && (
            <div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search library..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredLibraryOptions.map(option => (
                  <button
                    key={option.label}
                    onClick={() => handleLibraryOptionClick(option)}
                    className="flex flex-col items-center justify-center p-2 bg-slate-700 rounded-lg border-2 border-transparent hover:bg-slate-600 hover:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-200 aspect-square"
                  >
                    <div className="w-10 h-10 text-blue-400 mb-2">
                      <Icon name={option.icon} />
                    </div>
                    <span className="text-center font-semibold text-xs sm:text-sm text-gray-200">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'custom' && (
            <div className="flex justify-center items-center h-full">
              <form onSubmit={handleCustomSubmit} className="w-full max-w-sm">
                <h4 className="text-lg font-semibold text-center mb-4 text-gray-300">Create a custom entry</h4>
                <div className="flex flex-col gap-4">
                   <input
                        type="text"
                        value={customLabel}
                        onChange={(e) => setCustomLabel(e.target.value)}
                        placeholder="Enter custom name..."
                        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                        required
                        autoFocus
                    />
                    <button type="submit" className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500">
                        Save Custom Entry
                    </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AddOptionModal;
