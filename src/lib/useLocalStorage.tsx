import { useState, useEffect } from 'react';


export const useLocalStorage  = (key : string, initialValue : string | boolean | number | Record<string, unknown>) => {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue; // Handle client-side rendering (SSR)
    }

    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.error('Error parsing localStorage:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return; // Handle client-side rendering (SSR)
    }

    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};