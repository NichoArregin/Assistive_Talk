import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Client } from '../types';
import Calendar from '../components/Calendar';

interface CalendarPageProps {
  clients: Client[];
}

const CalendarPage: React.FC<CalendarPageProps> = ({ clients }) => {
  const { clientId } = useParams<{ clientId: string }>();
  const [currentDate, setCurrentDate] = useState(new Date());

  const client = clients.find(c => c.id === clientId);

  if (!client) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-100">Client not found</h2>
        <Link to="/" className="text-blue-400 hover:underline">Go back home</Link>
      </div>
    );
  }

  const events = useMemo(() => {
    return [
      ...client.activities.map(a => ({ ...a, type: 'activity' as const })),
      ...client.meals.map(m => ({ ...m, type: 'meal' as const })),
    ];
  }, [client.activities, client.meals]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 flex-wrap">
          <div className="flex items-center gap-4">
              <img src={client.imageUrl} alt={client.name} className="w-16 h-16 rounded-full object-cover shadow-lg border-4 border-slate-700" />
              <div>
                  <h2 className="text-3xl font-bold text-gray-100">{client.name}'s Calendar</h2>
                  <Link to={`/client/${client.id}`} className="text-blue-400 hover:underline text-sm inline-flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                      Back to Profile
                  </Link>
              </div>
          </div>
      </div>
      <div className="bg-slate-800 p-2 sm:p-4 rounded-xl shadow-lg">
        <Calendar 
            date={currentDate} 
            events={events} 
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
