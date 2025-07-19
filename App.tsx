import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ClientProfilePage from './pages/ClientProfilePage';
import CalendarPage from './pages/CalendarPage';
import AddClientPage from './pages/AddClientPage';
import Header from './components/Header';
import type { Client, Option, Mood, MoodEntry, DiaryEntry } from './types';

const CLIENTS_STORAGE_KEY = 'assistive-talk-clients';

const getInitialState = <T,>(key: string, defaultValue: T): T => {
  try {
    const storedItem = localStorage.getItem(key);
    return storedItem ? JSON.parse(storedItem) : defaultValue;
  } catch (error) {
    console.error(`Failed to initialize from localStorage for key ${key}`, error);
    return defaultValue;
  }
};

function App() {
  const [clients, setClients] = useState<Client[]>(() => getInitialState(CLIENTS_STORAGE_KEY, []));

  useEffect(() => {
    try {
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
    } catch (error) {
      console.error("Failed to save clients to localStorage", error);
    }
  }, [clients]);

  const handleAddClient = (name: string, imageUrl: string) => {
    const newClient: Client = {
      id: Date.now().toString(),
      name,
      imageUrl,
      activities: [],
      meals: [],
      moodHistory: [],
      diaryEntries: [],
    };
    setClients(prevClients => [...prevClients, newClient]);
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(prevClients => prevClients.filter(client => client.id !== clientId));
  };

  const handleAddActivity = (clientId: string, label: string, icon: string, date: string, time: string) => {
    const newActivity: Option = {
      id: `act_${Date.now()}`,
      label,
      icon,
      date,
      time,
    };
    setClients(prevClients =>
      prevClients.map(client =>
        client.id === clientId
          ? { ...client, activities: [...client.activities, newActivity] }
          : client
      )
    );
  };

  const handleDeleteActivity = (clientId: string, activityId: string) => {
    setClients(prevClients =>
      prevClients.map(client =>
        client.id === clientId
          ? { ...client, activities: client.activities.filter(act => act.id !== activityId) }
          : client
      )
    );
  };

  const handleAddMeal = (clientId: string, label: string, icon: string, date: string, time: string) => {
    const newMeal: Option = {
      id: `meal_${Date.now()}`,
      label,
      icon,
      date,
      time,
    };
    setClients(prevClients =>
      prevClients.map(client =>
        client.id === clientId
          ? { ...client, meals: [...client.meals, newMeal] }
          : client
      )
    );
  };

  const handleDeleteMeal = (clientId: string, mealId: string) => {
    setClients(prevClients =>
      prevClients.map(client =>
        client.id === clientId
          ? { ...client, meals: client.meals.filter(meal => meal.id !== mealId) }
          : client
      )
    );
  };
  
  const handleAddMoodEntry = (clientId: string, mood: Mood) => {
    const newMoodEntry: MoodEntry = {
      id: `mood_${Date.now()}`,
      mood,
      timestamp: new Date().toISOString(),
    };
    setClients(prevClients =>
      prevClients.map(client =>
        client.id === clientId
          ? {
              ...client,
              moodHistory: [newMoodEntry, ...client.moodHistory].slice(0, 5) // Keep last 5
            }
          : client
      )
    );
  };
  
  const handleAddDiaryEntry = (clientId: string, content: string) => {
    const newDiaryEntry: DiaryEntry = {
      id: `diary_${Date.now()}`,
      content,
      timestamp: new Date().toISOString(),
    };
    setClients(prevClients =>
      prevClients.map(client =>
        client.id === clientId
          ? {
              ...client,
              diaryEntries: [newDiaryEntry, ...client.diaryEntries],
            }
          : client
      )
    );
  };

  const todaysAlerts = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const alerts: any[] = [];
    clients.forEach(client => {
      const allEvents = [...client.activities, ...client.meals];
      const todayEvents = allEvents.filter(event => event.date === today && event.time);
      
      todayEvents.forEach(event => {
        alerts.push({
          clientId: client.id,
          clientName: client.name,
          clientImageUrl: client.imageUrl,
          eventLabel: event.label,
          eventTime: event.time,
        });
      });
    });
    return alerts.sort((a,b) => a.eventTime.localeCompare(b.eventTime));
  }, [clients]);

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-900 font-sans text-gray-100">
        <Header alerts={todaysAlerts} />
        <main className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<HomePage clients={clients} />} />
            <Route path="/client/:clientId" element={<ClientProfilePage 
              clients={clients} 
              onAddActivity={handleAddActivity}
              onAddMeal={handleAddMeal}
              onAddMoodEntry={handleAddMoodEntry}
              onAddDiaryEntry={handleAddDiaryEntry}
              onDeleteClient={handleDeleteClient}
              onDeleteActivity={handleDeleteActivity}
              onDeleteMeal={handleDeleteMeal}
            />} />
            <Route path="/client/:clientId/calendar" element={<CalendarPage clients={clients} />} />
            <Route path="/add-client" element={<AddClientPage onAddClient={handleAddClient} />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;