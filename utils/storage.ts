import { Habit, HabitEntry, HabitStats, HabitCategory, AppSettings } from '../types';
import { PerformanceMonitor, StorageOptimizer } from './performance';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Enhanced storage with persistence for web
class HabitStorage {
  private habits: Habit[] = [];
  private entries: HabitEntry[] = [];
  private categories: HabitCategory[] = [];
  private settings: AppSettings = {
    darkMode: false,
    notifications: true,
    weekStartsOn: 'monday',
    defaultView: 'grid',
    chartColor: '#40c463'
  };

  private readonly STORAGE_KEYS = {
    HABITS: 'habit_tracker_habits',
    ENTRIES: 'habit_tracker_entries',
    CATEGORIES: 'habit_tracker_categories',
    SETTINGS: 'habit_tracker_settings'
  };

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultCategories();
  }

  // Storage persistence methods
  private async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return AsyncStorage.getItem(key);
  }

  private async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  }

  private async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  }

  private loadFromStorage(): void {
    if (Platform.OS === 'web') {
      this.loadFromLocalStorage();
    } else {
      this.loadFromAsyncStorage();
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const habitsData = localStorage.getItem(this.STORAGE_KEYS.HABITS);
      if (habitsData) this.habits = JSON.parse(habitsData);
      const entriesData = localStorage.getItem(this.STORAGE_KEYS.ENTRIES);
      if (entriesData) this.entries = JSON.parse(entriesData);
      const categoriesData = localStorage.getItem(this.STORAGE_KEYS.CATEGORIES);
      if (categoriesData) this.categories = JSON.parse(categoriesData);
      const settingsData = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
      if (settingsData) this.settings = { ...this.settings, ...JSON.parse(settingsData) };
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
    }
  }

  private async loadFromAsyncStorage(): Promise<void> {
    try {
      const habitsData = await AsyncStorage.getItem(this.STORAGE_KEYS.HABITS);
      if (habitsData) this.habits = JSON.parse(habitsData);
      const entriesData = await AsyncStorage.getItem(this.STORAGE_KEYS.ENTRIES);
      if (entriesData) this.entries = JSON.parse(entriesData);
      const categoriesData = await AsyncStorage.getItem(this.STORAGE_KEYS.CATEGORIES);
      if (categoriesData) this.categories = JSON.parse(categoriesData);
      const settingsData = await AsyncStorage.getItem(this.STORAGE_KEYS.SETTINGS);
      if (settingsData) this.settings = { ...this.settings, ...JSON.parse(settingsData) };
    } catch (error) {
      console.error('Failed to load data from AsyncStorage:', error);
    }
  }

  // Clear all data (useful for testing or reset)
  clearAllData(): void {
    this.habits = [];
    this.entries = [];
    this.categories = [];
    this.settings = {
      darkMode: false,
      notifications: true,
      weekStartsOn: 'monday',
      defaultView: 'grid',
      chartColor: '#40c463'
    };
    
    try {
      this.removeItem(this.STORAGE_KEYS.HABITS);
      this.removeItem(this.STORAGE_KEYS.ENTRIES);
      this.removeItem(this.STORAGE_KEYS.CATEGORIES);
      this.removeItem(this.STORAGE_KEYS.SETTINGS);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
    
    this.initializeDefaultCategories();
  }

  // Check if storage is available (fallback for environments without localStorage)
  private isStorageAvailable(): boolean {
    try {
      const test = 'storage_test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private saveToStorage(): void {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(this.STORAGE_KEYS.HABITS, JSON.stringify(this.habits));
        localStorage.setItem(this.STORAGE_KEYS.ENTRIES, JSON.stringify(this.entries));
        localStorage.setItem(this.STORAGE_KEYS.CATEGORIES, JSON.stringify(this.categories));
        localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
      } catch (error) {
        console.error('Failed to save data to localStorage:', error);
      }
    } else {
      AsyncStorage.setItem(this.STORAGE_KEYS.HABITS, JSON.stringify(this.habits)).catch(err => console.error(err));
      AsyncStorage.setItem(this.STORAGE_KEYS.ENTRIES, JSON.stringify(this.entries)).catch(err => console.error(err));
      AsyncStorage.setItem(this.STORAGE_KEYS.CATEGORIES, JSON.stringify(this.categories)).catch(err => console.error(err));
      AsyncStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings)).catch(err => console.error(err));
    }
  }

  private initializeDefaultCategories(): void {
    // Only initialize if no categories exist
    if (this.categories.length === 0) {
      this.categories = [
        { id: '1', name: 'Health & Fitness', color: '#26d0ce', icon: '💪' },
        { id: '2', name: 'Learning', color: '#216e39', icon: '📚' },
        { id: '3', name: 'Productivity', color: '#f9ca24', icon: '⚡' },
        { id: '4', name: 'Mindfulness', color: '#6c5ce7', icon: '🧘' },
        { id: '5', name: 'Creativity', color: '#fd79a8', icon: '🎨' },
        { id: '6', name: 'Social', color: '#45b7d1', icon: '👥' },
      ];
      this.saveToStorage();
    }
  }

  // Habits management
  addHabit(habit: Omit<Habit, 'id' | 'order'>): Habit {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      order: this.habits.length,
      frequency: habit.frequency || 'daily',
    };
    this.habits.push(newHabit);
    this.saveToStorage();
    return newHabit;
  }

  getHabits(): Habit[] {
    return PerformanceMonitor.measureSync(
      () => this.habits.sort((a, b) => a.order - b.order),
      'getHabits'
    );
  }

  updateHabit(habitId: string, updates: Partial<Habit>): void {
    const index = this.habits.findIndex(h => h.id === habitId);
    if (index !== -1) {
      this.habits[index] = { ...this.habits[index], ...updates };
      this.saveToStorage();
    }
  }

  reorderHabits(habitIds: string[]): void {
    habitIds.forEach((id, index) => {
      const habit = this.habits.find(h => h.id === id);
      if (habit) {
        habit.order = index;
      }
    });
    this.saveToStorage();
  }

  deleteHabit(habitId: string): void {
    this.habits = this.habits.filter(h => h.id !== habitId);
    this.entries = this.entries.filter(e => e.habitId !== habitId);
    this.saveToStorage();
  }

  // Entries management
  toggleHabitEntry(habitId: string, date: string): void {
    const existingEntry = this.entries.find(
      e => e.habitId === habitId && e.date === date
    );

    if (existingEntry) {
      existingEntry.completed = !existingEntry.completed;
    } else {
      this.entries.push({
        habitId,
        date,
        completed: true,
      });
    }

    // Invalidate cache for this habit's stats
    StorageOptimizer.clearCache();
    this.saveToStorage();
  }

  getHabitEntries(habitId: string): { [date: string]: boolean } {
    const habitEntries = this.entries.filter(e => e.habitId === habitId);
    const entriesMap: { [date: string]: boolean } = {};
    
    habitEntries.forEach(entry => {
      entriesMap[entry.date] = entry.completed;
    });
    
    return entriesMap;
  }

  // Analytics
  getHabitStreak(habitId: string): number {
    const entries = this.getHabitEntries(habitId);
    const today = new Date();
    let streak = 0;

    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      if (entries[dateString]) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  getCompletionRate(habitId: string, days: number = 30): number {
    const entries = this.getHabitEntries(habitId);
    const today = new Date();
    let completed = 0;
    let total = 0;

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      total++;
      if (entries[dateString]) {
        completed++;
      }
    }

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  // Enhanced analytics
  getHabitStats(habitId: string): HabitStats {
    const cacheKey = `stats_${habitId}`;
    
    return StorageOptimizer.getWithCache(cacheKey, () => {
      return PerformanceMonitor.measureSync(() => {
        const entries = this.getHabitEntries(habitId);
        const currentStreak = this.getHabitStreak(habitId);
        const longestStreak = this.getLongestStreak(habitId);
        const completionRate30Days = this.getCompletionRate(habitId, 30);
        const completionRate7Days = this.getCompletionRate(habitId, 7);
        const totalCompletions = Object.values(entries).filter(Boolean).length;
        const averagePerWeek = this.getAveragePerWeek(habitId);

        return {
          habitId,
          currentStreak,
          longestStreak,
          completionRate30Days,
          completionRate7Days,
          totalCompletions,
          averagePerWeek,
        };
      }, `calculateStats_${habitId}`);
    });
  }

  getLongestStreak(habitId: string): number {
    const entries = this.getHabitEntries(habitId);
    const sortedDates = Object.keys(entries)
      .filter(date => entries[date])
      .sort();

    if (sortedDates.length === 0) return 0;

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dayDiff === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return maxStreak;
  }

  getAveragePerWeek(habitId: string, weeks: number = 12): number {
    const entries = this.getHabitEntries(habitId);
    const today = new Date();
    let totalCompletions = 0;

    for (let i = 0; i < weeks * 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      if (entries[dateString]) {
        totalCompletions++;
      }
    }

    return totalCompletions / weeks;
  }

  // Categories management
  getCategories(): HabitCategory[] {
    return this.categories;
  }

  addCategory(category: Omit<HabitCategory, 'id'>): HabitCategory {
    const newCategory: HabitCategory = {
      ...category,
      id: Date.now().toString(),
    };
    this.categories.push(newCategory);
    this.saveToStorage();
    return newCategory;
  }

  // Settings management
  getSettings(): AppSettings {
    return this.settings;
  }

  updateSettings(updates: Partial<AppSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.saveToStorage();
  }

  // Export functionality
  exportData(): string {
    return JSON.stringify({
      habits: this.habits,
      entries: this.entries,
      categories: this.categories,
      settings: this.settings,
      exportDate: new Date().toISOString(),
    }, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.habits) this.habits = data.habits;
      if (data.entries) this.entries = data.entries;
      if (data.categories) this.categories = data.categories;
      if (data.settings) this.settings = data.settings;
      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}

export const habitStorage = new HabitStorage();
