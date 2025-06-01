import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Habit, HabitCategory } from '../types';
// Import the new icon theme system (optional)
// import { ALL_ICONS, ALL_COLORS, suggestIconsForHabit } from '../config/iconThemes';

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'order'>) => void;
  categories: HabitCategory[];
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
  // NEW COLORS ADDED:
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
  '#ff8c00', // Dark Orange
  '#dc143c', // Crimson
  '#4169e1', // Royal Blue
  '#228b22', // Forest Green
];

const PREDEFINED_ICONS = [
  'fitness-outline', // Exercise/Fitness
  'book-outline', // Reading
  'water-outline', // Hydration
  'moon-outline', // Sleep
  'restaurant-outline', // Diet/Nutrition
  'walk-outline', // Walking
  'bicycle-outline', // Cycling
  'heart-outline', // Health
  'school-outline', // Learning
  'musical-notes-outline', // Music
  'brush-outline', // Art
  'calculator-outline', // Work
  'people-outline', // Social
  'leaf-outline', // Nature/Environment
  'camera-outline', // Photography
  'game-controller-outline', // Gaming
  'code-outline', // Programming
  'home-outline', // Home tasks
  'car-outline', // Transportation
  'gift-outline', // Personal
  'star-outline', // Goals
  'flame-outline', // Motivation
  'trending-up-outline', // Progress
  'checkmark-circle-outline', // Achievement
  // NEW ICONS ADDED:
  'barbell-outline', // Weightlifting
  'bed-outline', // Sleep/Rest
  'cafe-outline', // Coffee/Drinks
  'airplane-outline', // Travel
  'phone-portrait-outline', // Technology
  'sunny-outline', // Morning/Outdoor
  'rainy-outline', // Weather
  'thunderstorm-outline', // Energy/Power
  'snow-outline', // Winter/Cold
  'flower-outline', // Beauty/Nature
  'pizza-outline', // Food
  'wine-outline', // Social/Drinks
  'basketball-outline', // Sports
  'football-outline', // Football
  'tennisball-outline', // Tennis
  'golf-outline', // Golf
  'boat-outline', // Water Sports
  'train-outline', // Commute
  'library-outline', // Study
  'medal-outline', // Achievement
  'trophy-outline', // Competition
  'stopwatch-outline', // Time Management
  'alarm-outline', // Reminders
  'calendar-outline', // Planning
  'clipboard-outline', // Tasks
  'document-outline', // Writing
  'pencil-outline', // Notes
  'bulb-outline', // Ideas
  'construct-outline', // Building/Making
  'hammer-outline', // DIY/Repair
  'flash-outline', // Energy
  'headset-outline', // Music/Audio
  'tv-outline', // Entertainment
  'desktop-outline', // Computer Work
  'tablet-portrait-outline', // Digital
  'watch-outline', // Time
  'glasses-outline', // Reading/Focus
  'shirt-outline', // Clothing/Style
  'cut-outline', // Grooming
  'flower-outline', // Garden
  'paw-outline', // Pets
  'medical-outline', // Health
  'bandage-outline', // Recovery
  'thermometer-outline', // Health Tracking
  'scale-outline', // Weight
  'eye-outline', // Vision/Focus
  'ear-outline', // Listening
  'hand-right-outline', // Help/Volunteer
  'extension-puzzle-outline', // Problem Solving
  'options-outline', // Customization
  'refresh-outline', // Renewal
  'repeat-outline', // Routine
  'shuffle-outline', // Variety
];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  visible,
  onClose,
  onAddHabit,
  categories,
}) => {
  const [habitName, setHabitName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PREDEFINED_COLORS[0]);
  const [customColor, setCustomColor] = useState<string>('');
  const [showCustomColorInput, setShowCustomColorInput] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string>(PREDEFINED_ICONS[0]);
  const [customIcon, setCustomIcon] = useState<string>('');
  const [showCustomIconInput, setShowCustomIconInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'custom'>('daily');
  const [customFrequency, setCustomFrequency] = useState(3);
  const [goal, setGoal] = useState<number>();
  const [tags, setTags] = useState<string>('');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSubmit = () => {
    if (habitName.trim()) {
      onAddHabit({
        name: habitName.trim(),
        color: selectedColor,
        icon: selectedIcon,
        createdAt: new Date(),
        category: selectedCategory || undefined,
        frequency,
        customFrequency: frequency === 'custom' ? { daysPerWeek: customFrequency } : undefined,
        goal,
        tags: tags.trim() ? tags.split(',').map(tag => tag.trim()) : undefined,
        reminderTime: reminderEnabled ? reminderTime.toISOString() : undefined,
      });
      // Reset form
      setHabitName('');
      setSelectedColor(PREDEFINED_COLORS[0]);
      setSelectedIcon(PREDEFINED_ICONS[0]);
      setCustomIcon('');
      setShowCustomIconInput(false);
      setSelectedCategory('');
      setFrequency('daily');
      setCustomFrequency(3);
      setGoal(undefined);
      setTags('');
      setReminderEnabled(false);
      setReminderTime(new Date());
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>New Habit</Text>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={[styles.saveButton, !habitName.trim() && styles.disabledButton]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.label}>Habit Name</Text>
            <TextInput
              style={styles.textInput}
              value={habitName}
              onChangeText={setHabitName}
              placeholder="e.g., Exercise, Read, Meditate"
              autoFocus
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Color Theme</Text>
            <View style={styles.colorGrid}>
              {PREDEFINED_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColor,
                  ]}
                  onPress={() => {
                    setSelectedColor(color);
                    setCustomColor('');
                    setShowCustomColorInput(false);
                  }}
                />
              ))}
              {/* Custom Color Button */}
              <TouchableOpacity
                style={[
                  styles.colorOption,
                  styles.customColorButton,
                  { backgroundColor: showCustomColorInput ? selectedColor : '#f0f0f0' },
                  showCustomColorInput && styles.selectedColor,
                ]}
                onPress={() => setShowCustomColorInput(!showCustomColorInput)}
              >
                <Text style={styles.customColorButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            
            {/* Custom Color Input */}
            {showCustomColorInput && (
              <View style={styles.customColorContainer}>
                <Text style={styles.customColorLabel}>Enter hex color (e.g., #ff5733):</Text>
                <TextInput
                  style={styles.customColorInput}
                  value={customColor}
                  onChangeText={(text) => {
                    setCustomColor(text);
                    if (text.match(/^#[0-9A-F]{6}$/i)) {
                      setSelectedColor(text);
                    }
                  }}
                  placeholder="#ff5733"
                  autoCapitalize="none"
                  maxLength={7}
                />
                <Text style={styles.customColorHelper}>
                  Use any hex color code (including #)
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Icon</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconScroll}>
              {PREDEFINED_ICONS.map((iconName) => (
                <TouchableOpacity
                  key={iconName}
                  style={[
                    styles.iconOption,
                    selectedIcon === iconName && { backgroundColor: selectedColor },
                  ]}
                  onPress={() => {
                    setSelectedIcon(iconName);
                    setCustomIcon('');
                    setShowCustomIconInput(false);
                  }}
                >
                  <Ionicons
                    name={iconName as any}
                    size={24}
                    color={selectedIcon === iconName ? '#fff' : selectedColor}
                  />
                </TouchableOpacity>
              ))}
              {/* Custom Icon Button */}
              <TouchableOpacity
                style={[
                  styles.iconOption,
                  styles.customIconButton,
                  showCustomIconInput && { backgroundColor: selectedColor },
                ]}
                onPress={() => setShowCustomIconInput(!showCustomIconInput)}
              >
                <Ionicons
                  name="add-outline"
                  size={24}
                  color={showCustomIconInput ? '#fff' : selectedColor}
                />
              </TouchableOpacity>
            </ScrollView>
            
            {/* Custom Icon Input */}
            {showCustomIconInput && (
              <View style={styles.customIconContainer}>
                <Text style={styles.customIconLabel}>Enter Ionicon name:</Text>
                <TextInput
                  style={styles.customIconInput}
                  value={customIcon}
                  onChangeText={(text) => {
                    setCustomIcon(text);
                    if (text.trim()) {
                      setSelectedIcon(text.trim());
                    }
                  }}
                  placeholder="e.g., heart, star, home"
                  autoCapitalize="none"
                />
                <Text style={styles.customIconHelper}>
                  Find more icons at: ionicons.com
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              <TouchableOpacity
                style={[styles.categoryOption, !selectedCategory && styles.selectedCategory]}
                onPress={() => setSelectedCategory('')}
              >
                <Text style={styles.categoryText}>None</Text>
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryOption,
                    selectedCategory === category.id && styles.selectedCategory,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text style={styles.categoryEmoji}>{category.icon}</Text>
                  <Text style={styles.categoryText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Frequency</Text>
            <View style={styles.frequencyOptions}>
              {(['daily', 'weekly', 'custom'] as const).map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.frequencyOption,
                    frequency === freq && styles.selectedFrequency,
                  ]}
                  onPress={() => setFrequency(freq)}
                >
                  <Text style={[
                    styles.frequencyText,
                    frequency === freq && styles.selectedFrequencyText,
                  ]}>
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {frequency === 'custom' && (
              <View style={styles.customFrequencyContainer}>
                <Text style={styles.customFrequencyLabel}>Times per week:</Text>
                <View style={styles.customFrequencyButtons}>
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <TouchableOpacity
                      key={num}
                      style={[
                        styles.customFrequencyButton,
                        customFrequency === num && styles.selectedCustomFrequency,
                      ]}
                      onPress={() => setCustomFrequency(num)}
                    >
                      <Text style={[
                        styles.customFrequencyButtonText,
                        customFrequency === num && styles.selectedCustomFrequencyText,
                      ]}>
                        {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Goal (Optional)</Text>
            <TextInput
              style={styles.textInput}
              value={goal?.toString() || ''}
              onChangeText={(text) => setGoal(text ? parseInt(text) : undefined)}
              placeholder="e.g., 30 (target completions per month)"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Tags (Optional)</Text>
            <TextInput
              style={styles.textInput}
              value={tags}
              onChangeText={setTags}
              placeholder="e.g., health, morning, weekend"
            />
            <Text style={styles.helperText}>Separate tags with commas</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.reminderHeader}>
              <Text style={styles.label}>Reminder</Text>
              <Switch
                value={reminderEnabled}
                onValueChange={setReminderEnabled}
              />
            </View>
            {reminderEnabled && (
              <View>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Ionicons name="time-outline" size={20} color="#666" />
                  <Text style={styles.timeButtonText}>
                    {reminderTime.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </TouchableOpacity>
                {showTimePicker && (
                  <DateTimePicker
                    value={reminderTime}
                    mode="time"
                    display="default"
                    onChange={(event, selectedTime) => {
                      setShowTimePicker(false);
                      if (selectedTime) {
                        setReminderTime(selectedTime);
                      }
                    }}
                  />
                )}
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.previewLabel}>Preview</Text>
            <View style={styles.previewContainer}>
              <View style={styles.previewHeader}>
                <Ionicons
                  name={selectedIcon as any}
                  size={20}
                  color={selectedColor}
                />
                <Text style={styles.previewText}>
                  {habitName || 'Your habit name'}
                </Text>
              </View>
              <View style={styles.previewGrid}>
                {Array.from({ length: 7 }, (_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.previewSquare,
                      i < 3 && { backgroundColor: selectedColor },
                      i >= 3 && styles.emptySquare,
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cancelButton: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    fontSize: 16,
    color: '#0366d6',
    fontWeight: '600',
  },
  disabledButton: {
    color: '#ccc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e1e4e8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fafbfc',
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
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#333',
  },
  iconScroll: {
    marginTop: 8,
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#e1e4e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#fafbfc',
  },
  categoryScroll: {
    marginTop: 8,
  },
  categoryOption: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 12,
    marginRight: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e4e8',
    minWidth: 80,
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  frequencyOptions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  frequencyOption: {
    flex: 1,
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e4e8',
    alignItems: 'center',
  },
  selectedFrequency: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  frequencyText: {
    fontSize: 14,
    color: '#333',
  },
  selectedFrequencyText: {
    color: '#fff',
  },
  customFrequencyContainer: {
    marginTop: 12,
  },
  customFrequencyLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  customFrequencyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customFrequencyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e1e4e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCustomFrequency: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  customFrequencyButtonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedCustomFrequencyText: {
    color: '#fff',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e4e8',
    gap: 8,
  },
  timeButtonText: {
    fontSize: 16,
    color: '#333',
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  previewContainer: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e4e8',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  previewText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  previewGrid: {
    flexDirection: 'row',
    gap: 2,
  },
  previewSquare: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  emptySquare: {
    backgroundColor: '#ebedf0',
    borderWidth: 1,
    borderColor: '#e1e4e8',
  },
  customIconButton: {
    borderWidth: 2,
    borderColor: '#e1e4e8',
    borderStyle: 'dashed',
  },
  customIconContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e4e8',
  },
  customIconLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  customIconInput: {
    borderWidth: 1,
    borderColor: '#e1e4e8',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  customIconHelper: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  customColorButton: {
    borderWidth: 2,
    borderColor: '#e1e4e8',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customColorButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  customColorContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e4e8',
  },
  customColorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  customColorInput: {
    borderWidth: 1,
    borderColor: '#e1e4e8',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#fff',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  customColorHelper: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});
