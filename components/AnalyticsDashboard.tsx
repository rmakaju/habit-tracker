import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { Habit, HabitStats as HabitStatsType, AppSettings } from '../types';
import { useTheme } from './ThemeProvider';

interface AnalyticsDashboardProps {
  habits: Habit[];
  getHabitStats: (habitId: string) => HabitStatsType;
  getHabitEntries: (habitId: string) => { [date: string]: boolean }; // Add this for daily completions
  onHabitPress: (habit: Habit) => void;
  settings: AppSettings;
  onUpdateSettings: (updates: Partial<AppSettings>) => void;
}

const { width: screenWidth } = Dimensions.get('window');

// Predefined chart colors
const CHART_COLORS = [
  '#40c463', // Default green
  '#26d0ce', // Teal
  '#45b7d1', // Blue
  '#6c5ce7', // Purple
  '#fd79a8', // Pink
  '#f9ca24', // Yellow
  '#ff6b6b', // Red
  '#2ed573', // Light green
  '#5352ed', // Indigo
  '#ff9ff3', // Light pink
];

// Color Picker Component
interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  theme: any;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorSelect, theme }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [customHexColor, setCustomHexColor] = useState('');
  const [isUsingCustomColor, setIsUsingCustomColor] = useState(false);

  // Check if current color is custom (not in predefined colors)
  React.useEffect(() => {
    const isCustom = !CHART_COLORS.includes(selectedColor);
    setIsUsingCustomColor(isCustom);
    if (isCustom) {
      setCustomHexColor(selectedColor);
    } else {
      setCustomHexColor('');
    }
  }, [selectedColor]);

  const isValidHexColor = (hex: string): boolean => {
    const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(hex);
  };

  const normalizeHexColor = (hex: string): string => {
    let normalizedHex = hex.trim();
    if (!normalizedHex.startsWith('#')) {
      normalizedHex = '#' + normalizedHex;
    }
    return normalizedHex.toUpperCase();
  };

  const handleCustomHexChange = (text: string) => {
    setCustomHexColor(text);
    const normalizedHex = normalizeHexColor(text);
    
    if (isValidHexColor(normalizedHex)) {
      onColorSelect(normalizedHex);
      setIsUsingCustomColor(true);
    }
  };

  const handlePredefinedColorSelect = (color: string) => {
    onColorSelect(color);
    setIsUsingCustomColor(false);
    setCustomHexColor('');
    setIsExpanded(false);
  };

  return (
    <View style={[styles.colorPickerContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <TouchableOpacity 
        style={styles.colorPickerHeader}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.colorPickerInfo}>
          <Text style={[styles.colorPickerTitle, { color: theme.text }]}>Chart Color</Text>
          <Text style={[styles.colorPickerSubtitle, { color: theme.textSecondary }]}>
            Customize your chart appearance
          </Text>
        </View>
        <View style={styles.colorPickerPreview}>
          <View 
            style={[
              styles.selectedColorDot, 
              { backgroundColor: selectedColor }
            ]} 
          />
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={16} 
            color={theme.textSecondary} 
          />
        </View>
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.expandedColorPicker}>
          {/* Predefined Colors */}
          <View style={styles.colorGrid}>
            {CHART_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  {
                    backgroundColor: color,
                    borderColor: selectedColor === color && !isUsingCustomColor ? theme.text : 'transparent',
                    borderWidth: selectedColor === color && !isUsingCustomColor ? 2 : 0,
                  }
                ]}
                onPress={() => handlePredefinedColorSelect(color)}
              >
                {selectedColor === color && !isUsingCustomColor && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Hex Color Input */}
          <View style={styles.customColorSection}>
            <Text style={[styles.customColorLabel, { color: theme.textSecondary }]}>
              Or enter custom hex color:
            </Text>
            <View style={styles.customColorContainer}>
              <TextInput
                style={[
                  styles.hexInput,
                  {
                    backgroundColor: theme.background,
                    borderColor: isValidHexColor(normalizeHexColor(customHexColor)) 
                      ? theme.primary 
                      : theme.border,
                    color: theme.text,
                  }
                ]}
                value={customHexColor}
                onChangeText={handleCustomHexChange}
                placeholder="#FF5733 or FF5733"
                placeholderTextColor={theme.textSecondary}
                maxLength={7}
                autoCapitalize="characters"
              />
              {isUsingCustomColor && (
                <View style={[styles.customColorPreview, { backgroundColor: selectedColor }]}>
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
              )}
            </View>
            {customHexColor && !isValidHexColor(normalizeHexColor(customHexColor)) && (
              <Text style={styles.errorText}>Please enter a valid hex color (e.g., #FF5733)</Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

// Simple Bar Chart Component
interface DailyCompletionChartProps {
  data: { date: string; count: number; label: string }[];
  maxCount: number;
  theme: any;
  chartColor: string;
}

const DailyCompletionChart: React.FC<DailyCompletionChartProps> = ({ data, maxCount, theme, chartColor }) => {
  const chartWidth = screenWidth - 80; // Leave space for Y-axis labels
  const chartHeight = 180;
  const padding = 20;
  const pointSpacing = chartWidth / (data.length - 1);

  // Create points for the chart
  const createPoints = () => {
    return data.map((item, index) => {
      const x = index * pointSpacing;
      const y = maxCount > 0 ? chartHeight - (item.count / maxCount) * (chartHeight - padding) : chartHeight - padding;
      return { x, y, count: item.count };
    });
  };

  const points = createPoints();

  // Convert hex color to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Create smooth SVG path for the line
  const createLinePath = () => {
    if (points.length === 0) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    
    return path;
  };

  // Create smooth SVG path for the area fill
  const createAreaPath = () => {
    if (points.length === 0) return '';
    
    let path = `M ${points[0].x} ${chartHeight}`;
    path += ` L ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    
    path += ` L ${points[points.length - 1].x} ${chartHeight}`;
    path += ' Z'; // Close the path
    
    return path;
  };

  return (
    <View style={[styles.chartContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.chartTitle, { color: theme.text }]}>Daily Completions</Text>
      
      <View style={styles.chart}>
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          {Array.from({ length: 4 }, (_, i) => {
            const value = Math.ceil((maxCount * (3 - i)) / 3);
            return (
              <Text key={i} style={[styles.yAxisLabel, { color: theme.textSecondary }]}>
                {String(value || 0)}
              </Text>
            );
          })}
        </View>
        
        <View style={styles.chartArea}>
          {/* SVG Chart */}
          <Svg width={chartWidth} height={chartHeight} style={styles.svgChart}>
            {/* Grid lines */}
            {Array.from({ length: 4 }, (_, i) => (
              <Line
                key={`grid-${i}`}
                x1="0"
                y1={(chartHeight * i) / 3}
                x2={chartWidth}
                y2={(chartHeight * i) / 3}
                stroke={theme.border}
                strokeWidth="1"
                opacity="0.3"
              />
            ))}
            
            {/* Smooth area fill */}
            <Path
              d={createAreaPath()}
              fill={hexToRgba(chartColor, 0.15)}
              stroke="none"
            />
            
            {/* Smooth line */}
            <Path
              d={createLinePath()}
              fill="none"
              stroke={chartColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Data points */}
            {points.map((point, index) => (
              <Circle
                key={`point-${index}`}
                cx={point.x}
                cy={point.y}
                r="4"
                fill={chartColor}
                stroke={theme.card}
                strokeWidth="2"
              />
            ))}
          </Svg>
          
          {/* X-axis labels */}
          <View style={styles.xAxisLabels}>
            {data.map((item, index) => {
              // Show fewer labels for cleaner look
              if (index % 2 !== 0 && data.length > 7) return null;
              
              return (
                <Text 
                  key={item.date} 
                  style={[
                    styles.xAxisLabel, 
                    { 
                      color: theme.textSecondary,
                      left: index * pointSpacing - 15,
                      fontSize: 11,
                    }
                  ]}
                >
                  {item.label}
                </Text>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
};

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  habits,
  getHabitStats,
  getHabitEntries,
  onHabitPress,
  settings,
  onUpdateSettings,
}) => {
  const { theme } = useTheme();

  // Calculate daily completion data
  const getDailyCompletionData = () => {
    const data: { date: string; count: number; label: string }[] = [];
    const today = new Date();
    
    for (let i = 13; i >= 0; i--) { // Last 14 days
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Count actual completions for this date across all habits
      let count = 0;
      habits.forEach(habit => {
        const entries = getHabitEntries(habit.id);
        if (entries[dateString]) {
          count++;
        }
      });
      
      // Format label (show day of week for recent days, date for older)
      const label = i <= 6 
        ? date.toLocaleDateString('en', { weekday: 'short' })[0] // M, T, W, etc.
        : date.getDate().toString();
      
      data.push({ date: dateString, count, label });
    }
    
    return data;
  };

  const dailyCompletionData = getDailyCompletionData();

  const maxDailyCount = Math.max(...dailyCompletionData.map(d => d.count), 1);

  // Calculate overall stats
  const totalHabits = habits.length;
  const totalCompletions = habits.reduce((sum, habit) => {
    const stats = getHabitStats(habit.id);
    return sum + stats.totalCompletions;
  }, 0);
  
  const averageCompletion = habits.length > 0 
    ? habits.reduce((sum, habit) => {
        const stats = getHabitStats(habit.id);
        return sum + stats.completionRate7Days;
      }, 0) / habits.length
    : 0;

  const currentStreaks = habits.map(habit => ({
    habit,
    streak: getHabitStats(habit.id).currentStreak,
  })).sort((a, b) => b.streak - a.streak);

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    color = theme.primary 
  }: { 
    title: string; 
    value: string | number; 
    subtitle?: string; 
    icon: string; 
    color?: string;
  }) => (
    <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color: theme.text }]}>{String(value)}</Text>
      <Text style={[styles.statTitle, { color: theme.textSecondary }]}>{title}</Text>
      {subtitle && <Text style={[styles.statSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>}
    </View>
  );

  const HabitSummaryCard = ({ habit }: { habit: Habit }) => {
    const stats = getHabitStats(habit.id);
    return (
      <TouchableOpacity
        style={[styles.habitSummaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={() => onHabitPress(habit)}
      >
        <View style={styles.habitSummaryHeader}>
          <View style={[styles.habitColorDot, { backgroundColor: habit.color }]}>
            {habit.icon && (
              <Ionicons 
                name={habit.icon as any} 
                size={8} 
                color="white"
              />
            )}
          </View>
          <Text style={[styles.habitSummaryName, { color: theme.text }]} numberOfLines={1}>
            {habit.name}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
        </View>
        
        <View style={styles.habitSummaryStats}>
          <View style={styles.habitSummaryStatItem}>
            <Text style={[styles.habitSummaryStatValue, { color: habit.color }]}>
              {String(stats.currentStreak)}
            </Text>
            <Text style={[styles.habitSummaryStatLabel, { color: theme.textSecondary }]}>
              streak
            </Text>
          </View>
          <View style={styles.habitSummaryStatItem}>
            <Text style={[styles.habitSummaryStatValue, { color: theme.text }]}>
              {String(stats.completionRate7Days)}%
            </Text>
            <Text style={[styles.habitSummaryStatLabel, { color: theme.textSecondary }]}>
              week
            </Text>
          </View>
          <View style={styles.habitSummaryStatItem}>
            <Text style={[styles.habitSummaryStatValue, { color: theme.text }]}>
              {stats.averagePerWeek.toFixed(1)}
            </Text>
            <Text style={[styles.habitSummaryStatLabel, { color: theme.textSecondary }]}>
              avg
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Analytics</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Your habit tracking insights
        </Text>
      </View>

      {/* Overall Stats */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Habits"
            value={totalHabits}
            icon="leaf-outline"
            color="#26d0ce"
          />
          <StatCard
            title="Completions"
            value={totalCompletions}
            subtitle="all time"
            icon="checkmark-circle-outline"
            color="#40c463"
          />
          <StatCard
            title="Weekly Avg"
            value={`${averageCompletion.toFixed(0)}%`}
            subtitle="completion"
            icon="trending-up-outline"
            color="#f9ca24"
          />
          <StatCard
            title="Best Streak"
            value={currentStreaks.length > 0 ? Math.max(...currentStreaks.map(s => s.streak)) : 0}
            subtitle="days"
            icon="flame-outline"
            color="#ff6b6b"
          />
        </View>
      </View>

      {/* Daily Completion Chart */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Daily Completion Trend</Text>
        <ColorPicker 
          selectedColor={settings.chartColor}
          onColorSelect={(color) => onUpdateSettings({ chartColor: color })}
          theme={theme}
        />
        <DailyCompletionChart 
          data={dailyCompletionData} 
          maxCount={maxDailyCount} 
          theme={theme}
          chartColor={settings.chartColor}
        />
      </View>

      {/* Top Streaks */}
      {currentStreaks.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Current Streaks</Text>
          {currentStreaks.slice(0, 3).map(({ habit, streak }) => (
            <View key={habit.id} style={[styles.streakItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.streakIndicator, { backgroundColor: habit.color }]}>
                {habit.icon && (
                  <Ionicons 
                    name={habit.icon as any} 
                    size={12} 
                    color="white"
                  />
                )}
              </View>
              <Text style={[styles.streakHabitName, { color: theme.text }]}>{habit.name}</Text>
              <View style={styles.streakValue}>
                <Text style={[styles.streakNumber, { color: habit.color }]}>{String(streak)}</Text>
                <Text style={[styles.streakLabel, { color: theme.textSecondary }]}>days</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Habits Summary */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Habits Summary</Text>
        {habits.map(habit => (
          <HabitSummaryCard key={habit.id} habit={habit} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (screenWidth - 56) / 2, // 20px padding + 12px gap + 20px padding
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statTitle: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  streakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  streakIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakHabitName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  streakValue: {
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  streakLabel: {
    fontSize: 12,
  },
  streakIcon: {
    marginRight: 8,
  },
  habitSummaryCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  habitSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitSummaryIcon: {
    marginRight: 8,
  },
  habitColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitSummaryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  habitSummaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  habitSummaryStatItem: {
    alignItems: 'center',
  },
  habitSummaryStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  habitSummaryStatLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  chartContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginTop: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  chart: {
    flexDirection: 'row',
    height: 200,
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  yAxisLabel: {
    fontSize: 12,
  },
  chartArea: {
    flex: 1,
    position: 'relative',
  },
  svgChart: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  pointWrapper: {
    position: 'relative',
  },
  dataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  pointValue: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    width: 16,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1,
    position: 'relative',
  },
  barWrapper: {
    alignItems: 'center',
    marginRight: 4,
    position: 'relative',
  },
  bar: {
    borderRadius: 4,
  },
  barValue: {
    position: 'absolute',
    bottom: 100,
    fontSize: 10,
  },
  xAxisLabels: {
    position: 'absolute',
    bottom: -25,
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
  xAxisLabel: {
    position: 'absolute',
    fontSize: 12,
    textAlign: 'center',
    width: 20,
  },
  colorPickerContainer: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  colorPickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  colorPickerInfo: {
    flex: 1,
  },
  colorPickerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  colorPickerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  colorPickerPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectedColorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  expandedColorPicker: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customColorSection: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
  },
  customColorLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  customColorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hexInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'monospace',
  },
  customColorPreview: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4757',
    fontSize: 12,
    marginTop: 4,
  },
});
