import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Habit } from '../types';
import { useTheme } from './ThemeProvider';

interface CalendarViewProps {
  habits: Habit[];
  getHabitEntries: (habitId: string) => { [date: string]: boolean };
  onDatePress?: (date: string) => void;
  onToggleHabit?: (habitId: string, date: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const CalendarView: React.FC<CalendarViewProps> = ({
  habits,
  getHabitEntries,
  onDatePress,
  onToggleHabit,
}) => {
  const { theme } = useTheme();
  // Grid layout: 3 tiles per row (reduced size by ~1/3)
  const tileMargin = 6; // reduced from 8
  const tileWidth = (screenWidth - tileMargin * 4) / 3 * 0.75; // reduced by 25%
  const cellPadding = 3; // reduced from 4
  const cellSize = (tileWidth - cellPadding * 2) / 7; // 7 days

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDateModal, setShowDateModal] = useState(false);

  // Get the first day of the month
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  // Get the last day of the month
  const getLastDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  // Get days to display in the calendar (including previous/next month days)
  const getCalendarDays = () => {
    const firstDay = getFirstDayOfMonth(currentDate);
    const lastDay = getLastDayOfMonth(currentDate);
    const startDate = new Date(firstDay);
    
    // Go back to the first Sunday before the first day of the month
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    // Generate 42 days (6 weeks) for a complete calendar view
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  // Get completed habits for a specific date
  const getCompletedHabitsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return habits.filter(habit => {
      const entries = getHabitEntries(habit.id);
      return entries[dateString] === true;
    });
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const calendarDays = getCalendarDays();
  const monthYear = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleDatePress = (date: Date) => {
    setSelectedDate(date);
    setShowDateModal(true);
    if (onDatePress) {
      const dateString = date.toISOString().split('T')[0];
      onDatePress(dateString);
    }
  };

  const getHabitsForSelectedDate = () => {
    if (!selectedDate) return [];
    const dateString = selectedDate.toISOString().split('T')[0];
    return habits.map(habit => {
      const entries = getHabitEntries(habit.id);
      return {
        ...habit,
        completed: entries[dateString] === true,
      };
    });
  };

  const handleToggleHabit = (habitId: string) => {
    if (selectedDate && onToggleHabit) {
      const dateString = selectedDate.toISOString().split('T')[0];
      onToggleHabit(habitId, dateString);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>  
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Calendar</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Track your habits across time
        </Text>
      </View>

      {/* Month Navigation */}
      <View style={[styles.monthNavigation, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <Ionicons name="chevron-back" size={20} color={theme.text} />
        </TouchableOpacity>
        
        <View style={styles.monthInfo}>
          <Text style={[styles.monthText, { color: theme.text }]}>{monthYear}</Text>
          <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
            <Text style={[styles.todayButtonText, { color: theme.primary }]}>Today</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Day Headers */}
      <View style={styles.dayHeaders}>
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
          <View key={day} style={[styles.dayHeader, { width: cellSize }] }>
            <Text style={[styles.dayHeaderText, { color: theme.textSecondary }]}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Habit grid: 3 columns */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: tileMargin / 2 }}>
        {habits.map(habit => {
          const entries = getHabitEntries(habit.id);
          return (
            <View key={habit.id} style={{ width: tileWidth, margin: tileMargin / 2 }}>
              <View style={[styles.habitTitleContainer, { backgroundColor: habit.color }]}>
                <Text style={[styles.habitTitle, { color: 'white' }]} numberOfLines={1}>
                  {habit.name}
                </Text>
              </View>
              <View style={[styles.calendar, { paddingHorizontal: cellPadding }] }>
                {calendarDays.map((date, index) => {
                  const dateString = date.toISOString().split('T')[0];
                  const completed = entries[dateString] === true;
                  const isCurrentMonthDay = date.getMonth() === currentDate.getMonth();
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => onToggleHabit?.(habit.id, dateString)}
                      style={{ width: cellSize, height: cellSize, alignItems: 'center', justifyContent: 'center' }}
                    >
                      {completed ? (
                        <View style={{ width: cellSize * 0.55, height: cellSize * 0.55, borderRadius: (cellSize * 0.55) / 2, backgroundColor: habit.color, alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={[styles.dayNumber, { color: theme.background, fontSize: Math.max(8, cellSize * 0.3) }]}>{date.getDate()}</Text>
                        </View>
                      ) : (
                        <Text style={[styles.dayNumber, { color: isCurrentMonthDay ? theme.text : theme.textSecondary, fontSize: Math.max(8, cellSize * 0.3) }]}>{date.getDate()}</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16, // reduced from 20
    paddingTop: 50, // reduced from 60
  },
  title: {
    fontSize: 26, // reduced from 32
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14, // reduced from 16
    marginTop: 4,
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, // reduced from 20
    paddingVertical: 12, // reduced from 16
    marginHorizontal: 16, // reduced from 20
    marginBottom: 12, // reduced from 16
    borderRadius: 10, // reduced from 12
  },
  navButton: {
    padding: 6, // reduced from 8
  },
  monthInfo: {
    alignItems: 'center',
  },
  monthText: {
    fontSize: 18, // reduced from 20
    fontWeight: '600',
  },
  todayButton: {
    marginTop: 3, // reduced from 4
    paddingHorizontal: 10, // reduced from 12
    paddingVertical: 3, // reduced from 4
  },
  todayButtonText: {
    fontSize: 12, // reduced from 14
    fontWeight: '500',
  },
  dayHeaders: {
    flexDirection: 'row',
    paddingHorizontal: 8, // reduced from 10
    marginBottom: 6, // reduced from 8
  },
  dayHeader: {
    // width via inline style
    alignItems: 'center',
    paddingVertical: 1, // reduced from 2
  },
  dayHeaderText: {
    fontSize: 10, // reduced from 12
    fontWeight: '600',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    // styled inline per cell
  },
  dateCircle: {
    // size via inline style
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayNumber: {
    fontSize: 8, // reduced from 10
    fontWeight: '500',
  },
  habitTitle: {
    fontSize: 20, // increased back to original size for better readability
    fontWeight: '600',
    marginBottom: 3, // reduced from 4
    textAlign: 'center',
  },
  habitTitleContainer: {
    paddingHorizontal: 6, // reduced from 8
    paddingVertical: 3, // reduced from 4
    borderRadius: 6, // reduced from 8
    marginBottom: 3, // reduced from 4
  },
  legend: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  legendTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    maxWidth: (screenWidth - 80) / 2,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    flex: 1,
  },
  legendMore: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  habitItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitColorIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitItemName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  habitCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitSection: {
    marginBottom: 16, // less gap between habits
  },
});
