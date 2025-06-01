import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Habit } from '../types';

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

    return (
      <View style={styles.habitItem}>
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
            <Text style={styles.habitName}>{habit.name}</Text>
            {habit.category && (
              <Text style={styles.category}>#{habit.category}</Text>
            )}
          </View>
          
          {habit.tags && habit.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {habit.tags.map((tag) => (
                <Text key={tag} style={styles.tag}>
                  {tag}
                </Text>
              ))}
            </View>
          )}

          <Text style={styles.frequency}>
            {habit.frequency === 'daily' && 'Daily'}
            {habit.frequency === 'weekly' && 'Weekly'}
            {habit.frequency === 'custom' && `${habit.customFrequency}x per week`}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEditHabit(habit)}
          >
            <Ionicons name="pencil" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.todayButton,
              todayCompleted && { backgroundColor: habit.color },
            ]}
            onPress={() => onToggleEntry(habit.id, today)}
          >
            <Ionicons
              name={todayCompleted ? 'checkmark' : 'add'}
              size={20}
              color={todayCompleted ? '#fff' : habit.color}
            />
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Habits</Text>
        <Text style={styles.subtitle}>Tap + to complete today, or view grid for history</Text>
      </View>

      {habits.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="leaf-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No habits yet</Text>
          <Text style={styles.emptySubtitle}>Add your first habit to get started!</Text>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  habitItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitInfo: {
    flex: 1,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
    color: '#333',
    flex: 1,
  },
  category: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
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
    color: '#007AFF',
    backgroundColor: '#007AFF20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 6,
    marginBottom: 4,
  },
  frequency: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  todayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deleteButton: {
    padding: 8,
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
    color: '#999',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
    textAlign: 'center',
  },
});
