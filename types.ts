// Types for our habit tracker
export interface Habit {
  id: string;
  name: string;
  color: string;
  icon?: string; // Ionicon name for habit visualization
  createdAt: Date;
  category?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  customFrequency?: {
    daysPerWeek?: number; // Days per week for custom frequency
    specificDays?: number[]; // Specific days of the week (0=Sunday, 1=Monday, etc.)
  };
  goal?: number; // Target completions per period
  tags?: string[];
  order: number; // For reordering habits
  reminderTime?: string; // ISO string for reminder time
  notificationId?: string; // ID of scheduled notification
}

export interface HabitEntry {
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
}

export interface HabitStreak {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
}

export interface HabitStats {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  completionRate30Days: number;
  completionRate7Days: number;
  totalCompletions: number;
  averagePerWeek: number;
}

export interface HabitCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface AppSettings {
  darkMode: boolean;
  notifications: boolean;
  weekStartsOn: 'sunday' | 'monday';
  defaultView: 'grid' | 'list';
  chartColor: string;
}
