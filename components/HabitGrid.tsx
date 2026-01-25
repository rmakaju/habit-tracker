import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { AnimationUtils } from '../utils/animations';

interface ContributionSquareProps {
  date: string;
  completed: boolean;
  color: string;
  onPress: () => void;
  index: number;
}

const ContributionSquare: React.FC<ContributionSquareProps> = ({
  date,
  completed,
  color,
  onPress,
  index,
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered fade-in animation for initial load
    const delay = index * 2; // 2ms delay per square for smooth wave effect
    
    Animated.timing(opacityValue, {
      toValue: 1,
      duration: 300,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePress = () => {
    // Scale animation on press
    AnimationUtils.createSuccessAnimation(scaleValue, opacityValue).start();
    onPress();
  };

  const getSquareStyle = () => {
    const baseStyle = [
      styles.square,
      {
        transform: [{ scale: scaleValue }],
        opacity: opacityValue,
      },
    ];
    
    if (!completed) {
      return [...baseStyle, styles.emptySquare];
    }
    return [...baseStyle, { backgroundColor: color }];
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={getSquareStyle()}>
        {/* Optional: add day number for debugging */}
      </Animated.View>
    </TouchableOpacity>
  );
};

interface HabitGridProps {
  habitName: string;
  habitColor: string;
  entries: { [date: string]: boolean };
  onDatePress: (date: string) => void;
}

export const HabitGrid: React.FC<HabitGridProps> = ({
  habitName,
  habitColor,
  entries,
  onDatePress,
}) => {
  // Generate last 105 days (15 weeks)
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 104; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      dates.push(dateString);
    }
    return dates;
  };

  const dates = generateDates();
  
  // Group dates by weeks
  const weeks = [];
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.habitName}>{habitName}</Text>
      <View style={styles.grid}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.week}>
            {week.map((date, dayIndex) => {
              const globalIndex = weekIndex * 7 + dayIndex;
              return (
                <ContributionSquare
                  key={date}
                  date={date}
                  completed={entries[date] || false}
                  color={habitColor}
                  onPress={() => onDatePress(date)}
                  index={globalIndex}
                />
              );
            })}
          </View>
        ))}
      </View>
      
      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendText}>Less</Text>
        <View style={styles.legendSquares}>
          <View style={[styles.legendSquare, styles.emptySquare]} />
          <View style={[styles.legendSquare, { backgroundColor: habitColor, opacity: 0.3 }]} />
          <View style={[styles.legendSquare, { backgroundColor: habitColor, opacity: 0.6 }]} />
          <View style={[styles.legendSquare, { backgroundColor: habitColor }]} />
        </View>
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 16,
    marginInline: 'auto'
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    gap: Platform.select({ android: 3, default: 2 }),
  },
  week: {
    flexDirection: 'column',
    gap: Platform.select({ android: 3, default: 2 }),
  },
  square: {
    width: Platform.select({ android: 14, default: 12 }),
    height: Platform.select({ android: 14, default: 12 }),
    borderRadius: Platform.select({ android: 3, default: 2 }),
  },
  emptySquare: {
    backgroundColor: '#ebebeb',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  legendSquares: {
    flexDirection: 'row',
    gap: 2,
  },
  legendSquare: {
    width: Platform.select({ android: 12, default: 10 }),
    height: Platform.select({ android: 12, default: 10 }),
    borderRadius: Platform.select({ android: 3, default: 2 }),
  },
});
