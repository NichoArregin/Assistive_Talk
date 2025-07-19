import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import OptionSection from '../components/OptionSection';
import ConfirmationModal from '../components/ConfirmationModal';
import MoodTracker from '../components/MoodTracker';
import Diary from '../components/Diary';
import Icon from '../components/Icon';
import type { Client, Mood, DiaryEntry } from '../types';
import { DEFAULT_ACTIVITIES, DEFAULT_MEALS } from '../constants';

interface ClientProfilePageProps {
  clients: Client[];
  onAddActivity: (clientId: string, label: string, icon: string, date: string, time: string) => void;
  onAddMeal: (clientId: string, label: string, icon: string, date: string, time: string) => void;
  onAddMoodEntry: (clientId: string, mood: Mood) => void;
  onAddDiaryEntry: (clientId: string, content: string) => void;
  onDeleteClient: (clientId: string) => void;
  onDeleteActivity: (clientId: string, activityId: string) => void;
  onDeleteMeal: (clientId: string, mealId: string) => void;
}

const ClientProfilePage: React.FC<ClientProfilePageProps> = ({
  clients,
  onAddActivity,
  onAddMeal,
  onAddMoodEntry,
  onAddDiaryEntry,
  onDeleteClient,
  onDeleteActivity,
  onDeleteMeal,
}) => {
  const { clientId } = useParams<{ clientId: string }>();
  const { speak } = useTextToSpeech();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const client: Client | undefined = clients.find(c => c.id === clientId);

  if (!client) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Client not found</h2>
        <Link to="/" className="text-blue-400 hover:underline">Go back home</Link>
      </div>
    );
  }

  const handleOptionClick = (label: string) => {
    speak(label);
  };
  
  const handleAddClientActivity = (label: string, icon: string, date: string, time: string) => {
    onAddActivity(client.id, label, icon, date, time);
  };

  const handleAddClientMeal = (label: string, icon: string, date: string, time: string) => {
    onAddMeal(client.id, label, icon, date, time);
  };

  const handleAddClientMoodEntry = (mood: Mood) => {
    onAddMoodEntry(client.id, mood);
  };
  
  const handleAddClientDiaryEntry = (content: string) => {
    onAddDiaryEntry(client.id, content);
  }

  const confirmDeleteHandler = () => {
    onDeleteClient(client.id);
    setDeleteModalOpen(false);
    navigate('/');
  };
  
  const handleDeleteClientActivity = (activityId: string) => {
    onDeleteActivity(client.id, activityId);
  }
  
  const handleDeleteClientMeal = (mealId: string) => {
    onDeleteMeal(client.id, mealId);
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <img src={client.imageUrl} alt={client.name} className="w-20 h-20 rounded-full object-cover shadow-lg border-4 border-slate-700" />
          <h2 className="text-4xl font-bold text-gray-100">Hi, {client.name}!</h2>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/client/${client.id}/calendar`}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-500 transition"
            title="View Calendar"
          >
            <Icon name="calendar" className="w-5 h-5 mr-2" />
            <span>Calendar</span>
          </Link>
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Change Profile
          </Link>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
            aria-label="Delete client profile"
          >
            Delete Profile
          </button>
        </div>
      </div>

      <MoodTracker
        moodHistory={client.moodHistory}
        onAddMood={handleAddClientMoodEntry}
      />
      
      <Diary 
        diaryEntries={client.diaryEntries}
        onAddDiaryEntry={handleAddClientDiaryEntry}
      />

      <OptionSection
        title="What would you like to do today?"
        options={client.activities}
        defaultOptions={DEFAULT_ACTIVITIES}
        onOptionClick={handleOptionClick}
        onAddOption={handleAddClientActivity}
        onDeleteOption={handleDeleteClientActivity}
        searchPlaceholder="Search activities..."
        optionTypeName="Activity"
      />

      <OptionSection
        title="What would you like to eat?"
        options={client.meals}
        defaultOptions={DEFAULT_MEALS}
        onOptionClick={handleOptionClick}
        onAddOption={handleAddClientMeal}
        onDeleteOption={handleDeleteClientMeal}
        searchPlaceholder="Search meals..."
        optionTypeName="Meal"
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteHandler}
        title="Delete Profile"
        message={
          <>
            Are you sure you want to delete <strong>{client.name}'s</strong> profile?
            <br />
            This action cannot be undone.
          </>
        }
      />
    </div>
  );
};

export default ClientProfilePage;