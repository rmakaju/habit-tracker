import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { habitStorage } from '../utils/storage';

interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  text: string;
  textSecondary: string;
  border: string;
  card: string;
}

const lightTheme: ThemeColors = {
  background: '#f5f5f5',
  surface: '#ffffff',
  primary: '#007AFF',
  text: '#333333',
  textSecondary: '#666666',
  border: '#e0e0e0',
  card: '#ffffff',
};

const darkTheme: ThemeColors = {
  background: '#121212',
  surface: '#1e1e1e',
  primary: '#0A84FF',
  text: '#ffffff',
  textSecondary: '#aaaaaa',
  border: '#333333',
  card: '#2c2c2e',
};

interface ThemeContextType {
  theme: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  refreshTheme: () => void; // Force refresh from storage
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(habitStorage.getSettings());
  const [isDark, setIsDark] = useState(settings.darkMode);

  useEffect(() => {
    setIsDark(settings.darkMode);
  }, [settings.darkMode]);

  // Sync with storage changes
  useEffect(() => {
    const checkForSettingsUpdates = () => {
      const latestSettings = habitStorage.getSettings();
      if (latestSettings.darkMode !== settings.darkMode) {
        setSettings(latestSettings);
      }
    };

    // Check for settings updates periodically (for external changes)
    const interval = setInterval(checkForSettingsUpdates, 1000);
    return () => clearInterval(interval);
  }, [settings.darkMode]);

  const toggleTheme = () => {
    const newDarkMode = !settings.darkMode;
    const newSettings = { ...settings, darkMode: newDarkMode };
    setSettings(newSettings);
    setIsDark(newDarkMode);
    habitStorage.updateSettings(newSettings);
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    if ('darkMode' in updates) {
      setIsDark(newSettings.darkMode);
    }
    habitStorage.updateSettings(newSettings);
  };

  const refreshTheme = () => {
    const latestSettings = habitStorage.getSettings();
    setSettings(latestSettings);
    setIsDark(latestSettings.darkMode);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{
      theme,
      isDark,
      toggleTheme,
      settings,
      updateSettings,
      refreshTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
