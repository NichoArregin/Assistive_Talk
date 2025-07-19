
import { useCallback } from 'react';

export const useTextToSpeech = () => {
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.cancel(); // Cancel any previous speech
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Text-to-speech not supported in this browser.');
      alert('Sorry, your browser does not support text-to-speech.');
    }
  }, []);

  return { speak };
};
