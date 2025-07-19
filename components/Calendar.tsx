import React from 'react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import Icon from './Icon';

interface CalendarEvent {
  id: string;
  label: string;
  icon: string;
  date: string;
  type: 'activity' | 'meal';
}

interface CalendarProps {
  date: Date;
  events: CalendarEvent[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ date, events, onPrevMonth, onNextMonth, onToday }) => {
  const { speak } = useTextToSpeech();
  
  const month = date.getMonth();
  const year = date.getFullYear();

  const monthName = date.toLocaleString('default', { month: 'long' });
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const calendarGrid = [];
  // Add blank days for the start of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarGrid.push(<div key={`blank-start-${i}`} className="border-r border-b border-slate-700/50"></div>);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const loopDate = new Date(year, month, day);
    // Adjust for timezone issues by creating date string from UTC values
    const dateString = new Date(Date.UTC(year, month, day)).toISOString().split('T')[0];
    const todaysEvents = events.filter(e => e.date === dateString);
    const isToday = new Date().toDateString() === loopDate.toDateString();
    
    calendarGrid.push(
      <div key={day} className="relative p-1 sm:p-2 border-r border-b border-slate-700/50 min-h-[100px] sm:min-h-[120px] flex flex-col group">
        <time dateTime={dateString} className={`text-xs sm:text-sm font-semibold ${isToday ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : 'text-gray-300'}`}>
          {day}
        </time>
        <div className="flex-grow overflow-y-auto mt-1 space-y-1">
          {todaysEvents.map(event => (
            <button 
              key={event.id}
              onClick={() => speak(event.label)}
              title={event.label}
              className={`w-full text-left p-1 rounded-md text-xs font-semibold flex items-center gap-1.5 truncate ${
                event.type === 'activity' 
                ? 'bg-blue-500/20 hover:bg-blue-500/40 text-blue-200' 
                : 'bg-orange-500/20 hover:bg-orange-500/40 text-orange-200'
              } transition-colors`}
            >
              <div className="w-4 h-4 flex-shrink-0"><Icon name={event.icon} /></div>
              <span className="truncate">{event.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Add blank days for the end of the month to fill the grid
  const totalCells = firstDayOfMonth + daysInMonth;
  const remainingCells = (7 - (totalCells % 7)) % 7;
  for (let i = 0; i < remainingCells; i++) {
    calendarGrid.push(<div key={`blank-end-${i}`} className="border-r border-b border-slate-700/50"></div>);
  }

  return (
    <div className="text-white">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
        <h3 className="text-xl font-bold">{monthName} {year}</h3>
        <div className="flex items-center gap-2">
          <button onClick={onPrevMonth} className="px-3 py-1.5 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors" aria-label="Previous month">&lt;</button>
          <button onClick={onToday} className="px-3 py-1.5 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors">Today</button>
          <button onClick={onNextMonth} className="px-3 py-1.5 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors" aria-label="Next month">&gt;</button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-t border-l border-slate-700/50">
        {weekdays.map(day => (
          <div key={day} className="text-center font-bold text-gray-400 text-xs sm:text-sm p-2 border-r border-b border-slate-700/50 bg-slate-900/50">
            {day}
          </div>
        ))}
        {calendarGrid}
      </div>
    </div>
  );
};

export default Calendar;
