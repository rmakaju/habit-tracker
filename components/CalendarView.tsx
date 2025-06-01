import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Habit } from '../types';
import { useTheme } from './ThemeProvider';
import { PlatformConstants, ScreenUtils, CalendarConfig } from '../utils/platformUtils';

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
  
  // Responsive grid layout
  const isAndroid = Platform.OS === 'android';
  const isWeb = Platform.OS === 'web';
  const isTablet = screenWidth > 768;
  const isDesktop = screenWidth > 1024;
  
  // Calculate number of columns based on screen size
  let columnsPerRow = 1; // Default for mobile
  if (isDesktop) {
    columnsPerRow = 3; // Keep 3 columns on large screens
  } else if (isTablet || (isWeb && screenWidth > 600)) {
    columnsPerRow = 2; // 2 columns on tablets
  }
  
  const tileMargin = CalendarConfig.gridSpacing;
  const totalMargin = tileMargin * (columnsPerRow + 1);
  const baseTileWidth = (screenWidth - totalMargin) / columnsPerRow;
  const tileWidth = baseTileWidth * (isAndroid ? 0.95 : 0.9);
  const cellPadding = isAndroid ? 4 : 3;
  const cellSize = Math.max((tileWidth - cellPadding * 2) / 7, CalendarConfig.minCellSize);

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

      {/* Habit grid: responsive columns */}
      <View style={{ 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: columnsPerRow === 1 ? 'center' : 'space-between', 
        paddingHorizontal: tileMargin / 2 
      }}>
        {habits.map(habit => {
          const entries = getHabitEntries(habit.id);
          return (
            <View key={habit.id} style={{ 
              width: tileWidth, 
              margin: tileMargin / 2,
              marginBottom: tileMargin 
            }}>
              <View style={[styles.habitTitleContainer, { backgroundColor: habit.color }]}>
                <Text style={[
                  styles.habitTitle, 
                  { 
                    color: 'white',
                    fontSize: columnsPerRow === 1 ? 20 : (columnsPerRow === 2 ? 18 : 16)
                  }
                ]} numberOfLines={1}>
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
                      style={{ 
                        width: cellSize, 
                        height: cellSize, 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        minWidth: CalendarConfig.minCellSize,
                        minHeight: CalendarConfig.minCellSize,
                      }}
                    >
                      {completed ? (
                        <View style={{ 
                          width: cellSize * (isAndroid ? 0.65 : 0.55), 
                          height: cellSize * (isAndroid ? 0.65 : 0.55), 
                          borderRadius: (cellSize * (isAndroid ? 0.65 : 0.55)) / 2, 
                          backgroundColor: habit.color, 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}>
                          <Text style={[styles.dayNumber, { 
                            color: theme.background, 
                            fontSize: Math.max(isAndroid ? 10 : 8, cellSize * 0.3) 
                          }]}>{date.getDate()}</Text>
                        </View>
                      ) : (
                        <Text style={[styles.dayNumber, { 
                          color: isCurrentMonthDay ? theme.text : theme.textSecondary, 
                          fontSize: Math.max(isAndroid ? 10 : 8, cellSize * 0.3) 
                        }]}>{date.getDate()}</Text>
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
    padding: Platform.select({ android: 20, default: 16 }),
    paddingTop: Platform.select({ android: 60, default: 50 }),
  },
  title: {
    fontSize: Platform.select({ android: 28, default: 26 }),
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: Platform.select({ android: 16, default: 14 }),
    marginTop: 4,
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Platform.select({ android: 20, default: 16 }),
    paddingVertical: Platform.select({ android: 16, default: 12 }),
    marginHorizontal: Platform.select({ android: 20, default: 16 }),
    marginBottom: Platform.select({ android: 16, default: 12 }),
    borderRadius: Platform.select({ android: 12, default: 10 }),
  },
  navButton: {
    padding: Platform.select({ android: 12, default: 6 }),
    minWidth: Platform.select({ android: 44, default: 32 }),
    minHeight: Platform.select({ android: 44, default: 32 }),
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthInfo: {
    alignItems: 'center',
  },
  monthText: {
    fontSize: Platform.select({ android: 20, default: 18 }),
    fontWeight: '600',
  },
  todayButton: {
    marginTop: Platform.select({ android: 4, default: 3 }),
    paddingHorizontal: Platform.select({ android: 12, default: 10 }),
    paddingVertical: Platform.select({ android: 6, default: 3 }),
    minHeight: Platform.select({ android: 32, default: 24 }),
  },
  todayButtonText: {
    fontSize: Platform.select({ android: 14, default: 12 }),
    fontWeight: '500',
  },
  dayHeaders: {
    flexDirection: 'row',
    paddingHorizontal: Platform.select({ android: 12, default: 8 }),
    marginBottom: Platform.select({ android: 8, default: 6 }),
  },
  dayHeader: {
    // width via inline style
    alignItems: 'center',
    paddingVertical: Platform.select({ android: 4, default: 1 }),
    minHeight: Platform.select({ android: 24, default: 16 }),
  },
  dayHeaderText: {
    fontSize: Platform.select({ android: 12, default: 10 }),
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
    fontSize: Platform.select({ android: 10, default: 8 }),
    fontWeight: '500',
  },
  habitTitle: {
    fontWeight: '600',
    marginBottom: Platform.select({ android: 4, default: 3 }),
    textAlign: 'center',
    // fontSize is set dynamically based on screen size
  },
  habitTitleContainer: {
    paddingHorizontal: Platform.select({ android: 8, default: 6 }),
    paddingVertical: Platform.select({ android: 4, default: 3 }),
    borderRadius: Platform.select({ android: 8, default: 6 }),
    marginBottom: Platform.select({ android: 4, default: 3 }),
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
    paddingTop: Platform.select({ android: 60, default: 60 }),
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
