import React, { useState, useMemo } from 'react';
import type { Option, DefaultOption } from '../types';
import OptionButton from './OptionButton';
import Icon from './Icon';
import AddOptionModal from './AddOptionModal';

interface OptionSectionProps {
  title: string;
  options: Option[];
  defaultOptions: DefaultOption[];
  onOptionClick: (label: string) => void;
  onAddOption: (label: string, icon: string, date: string, time: string) => void;
  onDeleteOption: (optionId: string) => void;
  searchPlaceholder: string;
  optionTypeName: string;
}

const OptionSection: React.FC<OptionSectionProps> = ({
  title,
  options,
  defaultOptions,
  onOptionClick,
  onAddOption,
  onDeleteOption,
  searchPlaceholder,
  optionTypeName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    return options
      .filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [options, searchTerm]);

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h3 className="text-2xl font-semibold text-gray-200">{title}</h3>
        <div className="flex-grow sm:flex-grow-0 flex items-center gap-2">
          <div className="relative flex-grow">
            <span className="w-5 h-5 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-9 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
              aria-label={`Search ${title}`}
            />
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex-shrink-0 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 transition"
            aria-label={`Add new ${title}`}
          >
            <Icon name="plus" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {filteredOptions.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredOptions.map(option => (
            <OptionButton
              key={option.id}
              option={option}
              onClick={() => onOptionClick(option.label)}
              onDelete={() => onDeleteOption(option.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 mt-4 text-center">{searchTerm ? 'No results found.' : 'No options available. Add one to get started!'}</p>
      )}

      <AddOptionModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onAddOption={onAddOption}
        defaultOptions={defaultOptions}
        title={`Add ${optionTypeName}`}
      />
    </div>
  );
};

export default OptionSection;
