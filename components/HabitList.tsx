import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Habit } from '../types';
import { useTheme } from './ThemeProvider';
import { PlatformConstants } from '../utils/platformUtils';

interface HabitListProps {
  habits: Habit[];
  onReorder: (habitIds: string[]) => void;
  onDeleteHabit: (habitId: string) => void;
  onEditHabit: (habit: Habit) => void;
  onToggleEntry: (habitId: string, date: string) => void;
  getHabitEntries: (habitId: string) => { [date: string]: boolean };
}

export const HabitList: React.FC<HabitListProps> = ({
  habits,
  onDeleteHabit,
  onEditHabit,
  onToggleEntry,
  getHabitEntries,
}) => {
  const { theme } = useTheme();
  const today = new Date().toISOString().split('T')[0];

  const handleDeleteHabit = (habit: Habit) => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"? This will remove all data for this habit.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDeleteHabit(habit.id)
        },
      ]
    );
  };

  const HabitItem = ({ habit }: { habit: Habit }) => {
    const entries = getHabitEntries(habit.id);
    const todayCompleted = entries[today] || false;

    // Generate the current week starting from Sunday
    const getWeekDays = () => {
      const days = [];
      const currentDate = new Date();
      
      // Find the start of the current week (Sunday)
      const startOfWeek = new Date(currentDate);
      const currentDay = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      startOfWeek.setDate(currentDate.getDate() - currentDay);
      
      // Generate 7 days starting from Sunday
      const dayNames = ['S', 'M', 'T', 'W', 'Th', 'F', 'S'];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        const dayName = dayNames[i];
        
        days.push({
          date: dateString,
          dayName,
          completed: entries[dateString] || false,
          isToday: dateString === today,
        });
      }
      
      return days;
    };

    const weekDays = getWeekDays();

    return (
      <View style={[styles.habitItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.habitInfo}>
          <View style={styles.habitHeader}>
            <View style={[styles.colorIndicator, { backgroundColor: habit.color }]}>
              {habit.icon && (
                <Ionicons
                  name={habit.icon as any}
                  size={16}
                  color="white"
                />
              )}
            </View>
            <Text style={[styles.habitName, { color: theme.text }]}>{habit.name}</Text>
            {habit.category && (
              <Text style={[styles.category, { backgroundColor: theme.surface, color: theme.textSecondary }]}>#{habit.category}</Text>
            )}
          </View>
          
          {habit.tags && habit.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {habit.tags.map((tag) => (
                <Text key={tag} style={[styles.tag, { backgroundColor: theme.primary + '20', color: theme.primary }]}>
                  {tag}
                </Text>
              ))}
            </View>
          )}

          <Text style={[styles.frequency, { color: theme.textSecondary }]}>
            {habit.frequency === 'daily' && 'Daily'}
            {habit.frequency === 'weekly' && 'Weekly'}
            {habit.frequency === 'custom' && `${habit.customFrequency}x per week`}
          </Text>
        </View>

        {/* Weekly Grid - inline for web */}
        <View style={styles.weeklyGridInline}>
          {weekDays.map((day) => (
            <TouchableOpacity
              key={day.date}
              style={[
                styles.dayCell,
                day.completed 
                  ? { backgroundColor: habit.color }
                  : styles.emptyDayCell,
                day.isToday && !day.completed && { 
                  borderColor: habit.color, 
                  borderWidth: 1.5 
                },
              ]}
              onPress={() => onToggleEntry(habit.id, day.date)}
            >
              <Text style={[
                styles.dayName,
                { color: day.completed ? 'white' : theme.textSecondary },
                day.isToday && !day.completed && { color: habit.color, fontWeight: '600' },
              ]}>
                {day.dayName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEditHabit(habit)}
          >
            <Ionicons name="pencil" size={16} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteHabit(habit)}
          >
            <Ionicons name="trash-outline" size={18} color="#ff4757" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>All Habits</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Tap any day in the current week (Sun-Sat) to toggle completion</Text>
      </View>

      {habits.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="leaf-outline" size={64} color={theme.textSecondary} />
          <Text style={[styles.emptyTitle, { color: theme.textSecondary }]}>No habits yet</Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>Add your first habit to get started!</Text>
        </View>
      ) : (
        habits.map((habit) => (
          <HabitItem key={habit.id} habit={habit} />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  habitItem: {
    flexDirection: Platform.select({ android: 'column', default: 'row' }),
    alignItems: 'center',
    margin: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    gap: 8,
  },
  habitInfo: {
    flex: 1,
    minWidth: 0, // Prevents overflow
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  colorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitIcon: {
    marginRight: 8,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    marginEnd: 8,
  },
  category: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    fontSize: 11,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 6,
    marginBottom: 4,
  },
  frequency: {
    fontSize: 12,
    marginBottom: 12,
  },
  weeklyGridInline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: Platform.select({ android: 220, default: 300 }), // Fixed width for consistent alignment
    gap: Platform.select({ android: 4, default: 3 }),
    paddingHorizontal: 8,
    marginEnd: Platform.select({ android: 0, default: 400 }), // Add margin for web
  },
  weeklyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: Platform.select({ android: 3, default: 2 }),
  },
  dayCell: {
    width: Platform.select({ android: 24, default: 40 }),
    height: Platform.select({ android: 24, default: 40 }),
    borderRadius: Platform.select({ android: 12, default: 20 }), // Make circular
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyDayCell: {
    backgroundColor: '#393A40',
    borderWidth: 1,
    borderColor: '#393A40',
  },
  dayName: {
    fontSize: Platform.select({ android: 11, default: 10 }),
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8, // Add consistent spacing from weekly grid
  },
  editButton: {
    padding: Platform.select({ android: 12, default: 8 }),
    marginRight: 8,
    minWidth: Platform.select({ android: 44, default: 32 }),
    minHeight: Platform.select({ android: 44, default: 32 }),
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    padding: Platform.select({ android: 12, default: 8 }),
    minWidth: Platform.select({ android: 44, default: 32 }),
    minHeight: Platform.select({ android: 44, default: 32 }),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
