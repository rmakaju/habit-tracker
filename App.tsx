import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HabitGrid } from './components/HabitGrid';
import { AddHabitModal } from './components/AddHabitModal';
import { SettingsModal } from './components/SettingsModal';
import { HabitList } from './components/HabitList';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { CalendarView } from './components/CalendarView';
import { EditHabitModal } from './components/EditHabitModal';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { habitStorage } from './utils/storage';
import { NotificationService } from './utils/notifications';
import { Habit, HabitCategory, AppSettings } from './types';
import { PlatformConstants, ScreenUtils } from './utils/platformUtils';

// Main App Component with Enhanced Features
function MainApp() {
  const { theme, settings, updateSettings, refreshTheme } = useTheme();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<HabitCategory[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [activeTab, setActiveTab] = useState<'grid' | 'list' | 'analytics' | 'calendar'>('grid');
  const [refreshKey, setRefreshKey] = useState(0);
  const [animatedValues] = useState(new Map<string, Animated.Value>());

  useEffect(() => {
    const initializeApp = async () => {
      await loadData();
      await initializeNotifications();
    };
    
    initializeApp();
  }, [refreshKey]);

  const initializeNotifications = async () => {
    await NotificationService.requestPermissions();
  };

  const loadData = async () => {
    await habitStorage.waitForInitialization();
    setHabits(habitStorage.getHabits());
    setCategories(habitStorage.getCategories());
    refreshTheme(); // Refresh theme settings instead of using setSettings
  };

  const handleAddHabit = async (habitData: Omit<Habit, 'id' | 'order'>) => {
    const newHabit = habitStorage.addHabit(habitData);
    
    // Schedule notification if reminder is set
    if (newHabit.reminderTime && settings.notifications) {
      const reminderDate = new Date(newHabit.reminderTime);
      const notificationId = await NotificationService.scheduleHabitReminder(newHabit, reminderDate);
      
      if (notificationId) {
        // Update habit with notification ID
        habitStorage.updateHabit(newHabit.id, { notificationId });
      }
    }
    
    setRefreshKey(prev => prev + 1);
  };

  const handleDatePress = (habitId: string, date: string) => {
    // Get animation value for this habit
    if (!animatedValues.has(habitId)) {
      animatedValues.set(habitId, new Animated.Value(1));
    }
    const animValue = animatedValues.get(habitId)!;

    // Animate the habit completion
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    habitStorage.toggleHabitEntry(habitId, date);
    setRefreshKey(prev => prev + 1);
  };

  const handleUpdateHabit = (habitId: string, updates: Partial<Habit>) => {
    habitStorage.updateHabit(habitId, updates);
    setRefreshKey(prev => prev + 1);
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingHabit(null);
  };

  const handleDeleteHabit = async (habitId: string, habitName: string) => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habitName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // Cancel notification if exists
            const habit = habits.find(h => h.id === habitId);
            if (habit?.notificationId) {
              await NotificationService.cancelHabitReminder(habit.notificationId);
            }
            
            habitStorage.deleteHabit(habitId);
            setRefreshKey(prev => prev + 1);
          },
        },
      ]
    );
  };

  const handleUpdateSettings = async (updates: Partial<AppSettings>) => {
    // Update settings through theme context
    updateSettings(updates);
    
    // If notifications are disabled, cancel all notifications
    if ('notifications' in updates && !updates.notifications) {
      await NotificationService.cancelAllHabitReminders();
    }
    // If notifications are enabled, reschedule all habit reminders
    else if ('notifications' in updates && updates.notifications) {
      await NotificationService.rescheduleHabitReminders(habits);
    }
    
    setRefreshKey(prev => prev + 1);
  };

  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'grid':
        return (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {habits.length === 0 ? (
              <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
                <Ionicons name="checkmark-circle-outline" size={64} color={theme.text} opacity={0.3} />
                <Text style={[styles.emptyTitle, { color: theme.text }]}>No habits yet</Text>
                <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                  Start building better habits by tapping the + button above
                </Text>
              </View>
            ) : (
              ScreenUtils.width > 1024 ? (
                // Desktop: Two columns responsive layout  
                <View style={[
                  styles.gridContainer,
                  { justifyContent: 'space-evenly' }
                ]}>
                  {habits.map((habit, index) => {
                    const entries = habitStorage.getHabitEntries(habit.id);
                    const todayCompleted = entries[getTodayString()] || false;

                    return (
                      <View 
                        key={habit.id} 
                        style={[
                          styles.habitContainer, 
                          { backgroundColor: theme.surface },
                          { 
                            flexBasis: '48%',
                            maxWidth: '48%',
                            marginBottom: 16,
                            marginHorizontal: 0,
                          }
                        ]}
                      >
                        {/* Habit Header */}
                        <View style={styles.habitHeader}>
                          <View style={styles.habitInfo}>
                            <View style={styles.habitTitleRow}>
                              <View style={[styles.habitColorDot, { backgroundColor: habit.color }]}>
                                {habit.icon && (
                                  <Ionicons
                                    name={habit.icon as any}
                                    size={10}
                                    color="white"
                                  />
                                )}
                              </View>
                              <Text style={[styles.habitTitle, { color: theme.text }]}>{habit.name}</Text>
                              {todayCompleted && (
                                <Ionicons name="checkmark-circle" size={20} color={habit.color} />
                              )}
                            </View>
                            <View style={styles.statsRow}>
                              <Text style={[styles.statText, { color: theme.textSecondary }]}>
                                🔥 {habitStorage.getHabitStreak(habit.id)} day streak
                              </Text>
                              <Text style={[styles.statText, { color: theme.textSecondary }]}>
                                📊 {habitStorage.getCompletionRate(habit.id)}% this month
                              </Text>
                            </View>
                          </View>
                          <View style={styles.habitActions}>
                            <TouchableOpacity
                              onPress={() => handleEditHabit(habit)}
                              style={styles.editButton}
                            >
                              <Ionicons name="pencil" size={16} color={theme.textSecondary} />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleDeleteHabit(habit.id, habit.name)}
                              style={styles.deleteButton}
                            >
                              <Ionicons name="trash-outline" size={18} color={theme.textSecondary} />
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* Habit Grid */}
                        <HabitGrid
                          habitName=""
                          habitColor={habit.color}
                          entries={entries}
                          onDatePress={(date) => handleDatePress(habit.id, date)}
                        />
                      </View>
                    );
                  })}
                </View>
              ) : (
                // Mobile: Single column
                habits.map((habit) => {
                  const entries = habitStorage.getHabitEntries(habit.id);
                  const todayCompleted = entries[getTodayString()] || false;

                  return (
                    <View key={habit.id} style={[styles.habitContainer, { backgroundColor: theme.surface }]}>
                      {/* Habit Header */}
                      <View style={styles.habitHeader}>
                        <View style={styles.habitInfo}>
                          <View style={styles.habitTitleRow}>
                            <View style={[styles.habitColorDot, { backgroundColor: habit.color }]}>
                              {habit.icon && (
                                <Ionicons
                                  name={habit.icon as any}
                                  size={10}
                                  color="white"
                                />
                              )}
                            </View>
                            <Text style={[styles.habitTitle, { color: theme.text }]}>{habit.name}</Text>
                            {todayCompleted && (
                              <Ionicons name="checkmark-circle" size={20} color={habit.color} />
                            )}
                          </View>
                          <View style={styles.statsRow}>
                            <Text style={[styles.statText, { color: theme.textSecondary }]}>
                              🔥 {habitStorage.getHabitStreak(habit.id)} day streak
                            </Text>
                            <Text style={[styles.statText, { color: theme.textSecondary }]}>
                              📊 {habitStorage.getCompletionRate(habit.id)}% this month
                            </Text>
                          </View>
                        </View>
                        <View style={styles.habitActions}>
                          <TouchableOpacity
                            onPress={() => handleEditHabit(habit)}
                            style={styles.editButton}
                          >
                            <Ionicons name="pencil" size={16} color={theme.textSecondary} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleDeleteHabit(habit.id, habit.name)}
                            style={styles.deleteButton}
                          >
                            <Ionicons name="trash-outline" size={18} color={theme.textSecondary} />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Habit Grid */}
                      <HabitGrid
                        habitName=""
                        habitColor={habit.color}
                        entries={entries}
                        onDatePress={(date) => handleDatePress(habit.id, date)}
                      />
                    </View>
                  );
                })
              )
            )}
          </ScrollView>
        );
      case 'list':
        return (
          <HabitList
            habits={habits}
            onReorder={(habitIds: string[]) => {
              habitStorage.reorderHabits(habitIds);
              setRefreshKey(prev => prev + 1);
            }}
            onDeleteHabit={(habitId: string) => {
              const habit = habits.find(h => h.id === habitId);
              if (habit) {
                handleDeleteHabit(habitId, habit.name);
              }
            }}
            onEditHabit={handleEditHabit}
            onToggleEntry={handleDatePress}
            getHabitEntries={(habitId: string) => habitStorage.getHabitEntries(habitId)}
          />
        );
      case 'analytics':
        return (
          <AnalyticsDashboard
            habits={habits}
            getHabitStats={(habitId: string) => habitStorage.getHabitStats(habitId)}
            getHabitEntries={(habitId: string) => habitStorage.getHabitEntries(habitId)}
            onHabitPress={() => {}}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        );
      case 'calendar':
        return (
          <CalendarView
            habits={habits}
            getHabitEntries={(habitId: string) => habitStorage.getHabitEntries(habitId)}
            onDatePress={(date: string) => {
              // Optional: could implement multi-habit toggle for a specific date
              console.log('Date pressed:', date);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.text === '#ffffff' ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Habit Tracker</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowSettingsModal(true)}
          >
            <Ionicons name="settings-outline" size={24} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'grid' && { borderBottomColor: theme.primary }]}
          onPress={() => setActiveTab('grid')}
        >
          <Ionicons 
            name="grid-outline" 
            size={20} 
            color={activeTab === 'grid' ? theme.primary : theme.textSecondary} 
          />
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'grid' ? theme.primary : theme.textSecondary }
          ]}>Grid</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'list' && { borderBottomColor: theme.primary }]}
          onPress={() => setActiveTab('list')}
        >
          <Ionicons 
            name="list-outline" 
            size={20} 
            color={activeTab === 'list' ? theme.primary : theme.textSecondary} 
          />
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'list' ? theme.primary : theme.textSecondary }
          ]}>List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'analytics' && { borderBottomColor: theme.primary }]}
          onPress={() => setActiveTab('analytics')}
        >
          <Ionicons 
            name="analytics-outline" 
            size={20} 
            color={activeTab === 'analytics' ? theme.primary : theme.textSecondary} 
          />
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'analytics' ? theme.primary : theme.textSecondary }
          ]}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'calendar' && { borderBottomColor: theme.primary }]}
          onPress={() => setActiveTab('calendar')}
        >
          <Ionicons 
            name="calendar-outline" 
            size={20} 
            color={activeTab === 'calendar' ? theme.primary : theme.textSecondary} 
          />
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'calendar' ? theme.primary : theme.textSecondary }
          ]}>Calendar</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Progress */}
      {habits.length > 0 && activeTab !== 'analytics' && (
        <View style={[styles.todaySection, { backgroundColor: theme.surface }]}>
          <Text style={[styles.todaySectionTitle, { color: theme.text }]}>Today's Progress</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.todayHorizontalGrid}
          >
            {habits.map((habit) => {
              const entries = habitStorage.getHabitEntries(habit.id);
              const todayCompleted = entries[getTodayString()] || false;
              
              return (
                <Animated.View
                  key={habit.id}
                  style={{
                    transform: [{ 
                      scale: animatedValues.get(habit.id) || new Animated.Value(1) 
                    }],
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.todayHabitHorizontalCard,
                      { 
                        borderColor: theme.border,
                        backgroundColor: todayCompleted ? habit.color + '20' : theme.surface,
                      },
                    ]}
                    onPress={() => handleDatePress(habit.id, getTodayString())}
                  >
                    <View
                      style={[
                        styles.todayHabitDot,
                        {
                          backgroundColor: todayCompleted ? habit.color : theme.border,
                        },
                      ]}
                    >
                      {habit.icon && (
                        <Ionicons
                          name={habit.icon as any}
                          size={12}
                          color={todayCompleted ? "white" : theme.textSecondary}
                        />
                      )}
                    </View>
                    <Text 
                      style={[
                        styles.todayHabitName, 
                        { 
                          color: todayCompleted ? habit.color : theme.text,
                          fontWeight: todayCompleted ? '600' : '500',
                        }
                      ]}
                      numberOfLines={1}
                    >
                      {habit.name}
                    </Text>
                    {todayCompleted && (
                      <Ionicons name="checkmark" size={16} color={habit.color} />
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Content */}
      {renderContent()}

      {/* Modals */}
      <AddHabitModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddHabit={handleAddHabit}
        categories={categories}
      />

      <SettingsModal
        visible={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onExportData={() => habitStorage.exportData()}
        onImportData={(data: string) => habitStorage.importData(data)}
      />

      <EditHabitModal
        visible={showEditModal}
        onClose={handleCloseEditModal}
        onUpdateHabit={handleUpdateHabit}
        habit={editingHabit}
      />
    </SafeAreaView>
  );
}

// Main App with Theme Provider
export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfc',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    alignItems: 'flex-start',
    gap: 8, // Add gap between items
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: (PlatformConstants.statusBarHeight || 24) + 8,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#0366d6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  habitContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16, // Default for mobile, overridden inline for responsive
    marginVertical: 8, // Default for mobile, overridden inline for responsive
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  habitInfo: {
    flex: 1,
  },
  habitTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  habitColorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  habitActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    padding: 6,
  },
  deleteButton: {
    padding: 4,
  },
  todaySection: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todaySectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  todayGrid: {
    gap: 8,
  },
  todayHorizontalGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 4,
  },
  todayHabitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e4e8',
  },
  todayHabitHorizontalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    minWidth: 100,
    maxWidth: 160,
  },
  todayHabitDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayHabitIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  completedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  todayHabitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  todayHabitName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginRight: 4,
  },
});
