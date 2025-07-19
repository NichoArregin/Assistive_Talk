export type Mood = 'happy' | 'content' | 'sad' | 'upset';

export interface MoodEntry {
  id: string;
  mood: Mood;
  timestamp: string;
}

export interface DiaryEntry {
  id: string;
  content: string;
  timestamp: string;
}

export interface Option {
  id: string;
  label: string;
  icon: string;
  date: string;
  time: string;
}

export interface DefaultOption {
  label: string;
  icon: string;
}

export interface Client {
  id: string;
  name: string;
  imageUrl: string;
  activities: Option[];
  meals: Option[];
  moodHistory: MoodEntry[];
  diaryEntries: DiaryEntry[];
}