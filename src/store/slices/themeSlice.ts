import { createSlice } from '@reduxjs/toolkit';
import { ThemeState } from '../../types';

const loadThemeFromStorage = (): 'light' | 'dark' => {
  try {
    const savedTheme = localStorage.getItem('trello-theme');
    return (savedTheme as 'light' | 'dark') || 'light';
  } catch (err) {
    return 'light';
  }
};

const saveThemeToStorage = (theme: 'light' | 'dark'): void => {
  try {
    localStorage.setItem('trello-theme', theme);
  } catch (err) {
    console.error('Could not save theme to localStorage:', err);
  }
};

const initialState: ThemeState = {
  theme: loadThemeFromStorage()
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      saveThemeToStorage(state.theme);
    }
  }
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;