import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Habit } from '../types';
import { useTheme } from './ThemeProvider';

interface EditHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onUpdateHabit: (habitId: string, updates: Partial<Habit>) => void;
  habit: Habit | null;
}

const PREDEFINED_COLORS = [
  '#26d0ce', // Teal
  '#216e39', // Dark Green
  '#40c463', // Green
  '#9be9a8', // Light Green
  '#ff6b6b', // Red
  '#4ecdc4', // Cyan
  '#45b7d1', // Blue
  '#f9ca24', // Yellow
  '#f0932b', // Orange
  '#eb4d4b', // Dark Red
  '#6c5ce7', // Purple
  '#fd79a8', // Pink
  '#2ed573', // Bright Green
  '#ff4757', // Bright Red
  '#3742fa', // Bright Blue
  '#2f3542', // Dark Gray
  '#57606f', // Gray
  '#ffa502', // Bright Orange
  '#ff6348', // Coral
  '#1e90ff', // Dodger Blue
  '#32cd32', // Lime Green
  '#ff1493', // Deep Pink
  '#9932cc', // Dark Orchid
  '#00ced1', // Dark Turquoise
];

const PREDEFINED_ICONS = [
  'checkmark-circle-outline',
  'fitness-outline',
  'water-outline',
  'book-outline',
  'bed-outline',
  'restaurant-outline',
  'walk-outline',
  'bicycle-outline',
  'barbell-outline',
  'heart-outline',
  'leaf-outline',
  'sunny-outline',
  'moon-outline',
  'time-outline',
  'phone-portrait-outline',
  'laptop-outline',
  'car-outline',
  'home-outline',
  'school-outline',
  'briefcase-outline',
  'people-outline',
  'camera-outline',
  'musical-notes-outline',
  'game-controller-outline',
  'airplane-outline',
  'train-outline',
  'library-outline',
  'medal-outline',
  'trophy-outline',
  'stopwatch-outline',
  'alarm-outline',
  'calendar-outline',
  'clipboard-outline',
  'document-outline',
  'pencil-outline',
  'bulb-outline',
  'construct-outline',
  'hammer-outline',
  'flash-outline',
  'headset-outline',
  'tv-outline',
  'desktop-outline',
  'tablet-portrait-outline',
  'watch-outline',
  'glasses-outline',
  'shirt-outline',
  'cut-outline',
  'flower-outline',
  'paw-outline',
  'medical-outline',
  'bandage-outline',
  'thermometer-outline',
  'scale-outline',
  'eye-outline',
  'ear-outline',
  'hand-right-outline',
  'extension-puzzle-outline',
  'options-outline',
  'refresh-outline',
  'repeat-outline',
  'shuffle-outline',
];

export const EditHabitModal: React.FC<EditHabitModalProps> = ({
  visible,
  onClose,
  onUpdateHabit,
  habit,
}) => {
  const { theme } = useTheme();
  const [habitName, setHabitName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PREDEFINED_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState<string>(PREDEFINED_ICONS[0]);
  const [customHexColor, setCustomHexColor] = useState('');
  const [isUsingCustomColor, setIsUsingCustomColor] = useState(false);

  useEffect(() => {
    if (habit) {
      setHabitName(habit.name);
      setSelectedColor(habit.color);
      setSelectedIcon(habit.icon || PREDEFINED_ICONS[0]);
      
      // Check if the current color is a custom hex color
      const isCustom = !PREDEFINED_COLORS.includes(habit.color);
      setIsUsingCustomColor(isCustom);
      if (isCustom) {
        setCustomHexColor(habit.color);
      } else {
        setCustomHexColor('');
      }
    }
  }, [habit]);

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
      setSelectedColor(normalizedHex);
      setIsUsingCustomColor(true);
    }
  };

  const handlePredefinedColorSelect = (color: string) => {
    setSelectedColor(color);
    setIsUsingCustomColor(false);
    setCustomHexColor('');
  };

  const handleSave = () => {
    if (!habit) return;
    
    if (habitName.trim() === '') {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    onUpdateHabit(habit.id, {
      name: habitName.trim(),
      color: selectedColor,
      icon: selectedIcon,
    });

    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!habit) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={handleClose} style={styles.headerButton}>
            <Text style={[styles.headerButtonText, { color: theme.primary }]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Edit Habit</Text>
          <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
            <Text style={[styles.headerButtonText, { color: theme.primary }]}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Habit Name */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Habit Name</Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  color: theme.text,
                }
              ]}
              value={habitName}
              onChangeText={setHabitName}
              placeholder="Enter habit name"
              placeholderTextColor={theme.textSecondary}
              maxLength={50}
            />
          </View>

          {/* Preview */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Preview</Text>
            <View style={[styles.previewContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.previewCircle, { backgroundColor: selectedColor }]}>
                {selectedIcon && (
                  <Ionicons
                    name={selectedIcon as any}
                    size={24}
                    color="white"
                  />
                )}
              </View>
              <Text style={[styles.previewText, { color: theme.text }]}>
                {habitName || 'Habit Name'}
              </Text>
            </View>
          </View>

          {/* Color Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Color</Text>
            
            {/* Predefined Colors */}
            <View style={styles.colorGrid}>
              {PREDEFINED_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    {
                      backgroundColor: color,
                      borderColor: selectedColor === color && !isUsingCustomColor ? theme.text : 'transparent',
                      borderWidth: selectedColor === color && !isUsingCustomColor ? 3 : 0,
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
                      backgroundColor: theme.card,
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

          {/* Icon Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Icon</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.iconGrid}>
                {PREDEFINED_ICONS.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[
                      styles.iconOption,
                      {
                        backgroundColor: selectedIcon === icon ? selectedColor : theme.card,
                        borderColor: theme.border,
                      }
                    ]}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <Ionicons
                      name={icon as any}
                      size={20}
                      color={selectedIcon === icon ? 'white' : theme.text}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  previewCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewText: {
    fontSize: 16,
    fontWeight: '500',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  customColorSection: {
    marginTop: 16,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4757',
    fontSize: 12,
    marginTop: 4,
  },
  iconGrid: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 16,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});
