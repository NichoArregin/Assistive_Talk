import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

interface Alert {
  clientId: string;
  clientName: string;
  clientImageUrl: string;
  eventLabel: string;
  eventTime: string;
}

interface HeaderProps {
  alerts: Alert[];
}

const Header: React.FC<HeaderProps> = ({ alerts }) => {
  const [isAlertsOpen, setAlertsOpen] = useState(false);
  const alertsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (alertsRef.current && !alertsRef.current.contains(event.target as Node)) {
        setAlertsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg shadow-blue-500/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-blue-400">
              <Link to="/" className="hover:opacity-80 transition-opacity">Assistive Talk</Link>
            </h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">Empowering communication for everyone</p>
          </div>
          <div className="relative" ref={alertsRef}>
            <button
              onClick={() => setAlertsOpen(prev => !prev)}
              className="relative p-2 rounded-full text-gray-300 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white"
              aria-label="View alerts"
            >
              <Icon name="bell" className="h-6 w-6" />
              {alerts.length > 0 && (
                <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-slate-800" />
              )}
            </button>
            {isAlertsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2">
                <div className="px-4 py-2 border-b border-slate-700">
                  <h4 className="font-bold text-gray-100">Today's Events</h4>
                </div>
                {alerts.length > 0 ? (
                  <ul className="max-h-96 overflow-y-auto">
                    {alerts.map((alert, index) => (
                      <li key={index}>
                        <Link
                          to={`/client/${alert.clientId}`}
                          onClick={() => setAlertsOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors"
                        >
                          <img src={alert.clientImageUrl} alt={alert.clientName} className="w-10 h-10 rounded-full object-cover"/>
                          <div className="flex-1 overflow-hidden">
                            <p className="font-semibold text-sm text-gray-200 truncate">{alert.clientName}</p>
                            <p className="text-xs text-gray-400 truncate">{alert.eventLabel}</p>
                          </div>
                          <span className="text-xs font-mono text-blue-400">{formatTime(alert.eventTime)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-center py-4 px-4 text-sm">No events scheduled for today.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
