// Icon and Color Configuration
// This file makes it easy to add new icons and colors organized by categories

export interface IconTheme {
  category: string;
  icons: string[];
  colors: string[];
}

export const ICON_THEMES: IconTheme[] = [
  {
    category: 'Fitness & Health',
    icons: [
      'fitness-outline',
      'barbell-outline',
      'walk-outline',
      'bicycle-outline',
      'basketball-outline',
      'football-outline',
      'tennisball-outline',
      'golf-outline',
      'boat-outline',
      'heart-outline',
      'medical-outline',
      'bandage-outline',
      'thermometer-outline',
      'scale-outline',
      // NEW FITNESS ICONS:
      'timer-outline',
      'pulse-outline',
      'body-outline',
      'shield-outline',
      'water-outline',
      'nutrition-outline',
      'stopwatch-outline',
      'fitness',
      'American-football-outline',
      'baseball-outline',
      'ice-cream-outline',
      'leaf-outline',
      'accessibility-outline',
      'man-outline',
      'woman-outline',
      'people-outline',
    ],
    colors: [
      '#26d0ce', // Teal
      '#40c463', // Green
      '#ff6b6b', // Red
      '#2ed573', // Bright Green
      '#ff4757', // Bright Red
      '#32cd32', // Lime Green
      '#228b22', // Forest Green
      // NEW HEALTH COLORS:
      '#00fa9a', // Medium Spring Green
      '#98fb98', // Pale Green
      '#7fffd4', // Aquamarine
      '#20b2aa', // Light Sea Green
      '#ff69b4', // Hot Pink
      '#dc143c', // Crimson
    ],
  },
  {
    category: 'Learning & Work',
    icons: [
      'book-outline',
      'school-outline',
      'library-outline',
      'calculator-outline',
      'code-outline',
      'desktop-outline',
      'tablet-portrait-outline',
      'document-outline',
      'pencil-outline',
      'clipboard-outline',
      'bulb-outline',
      'glasses-outline',
      // NEW LEARNING ICONS:
      'laptop-outline',
      'folder-outline',
      'filing-outline',
      'archive-outline',
      'bookmark-outline',
      'newspaper-outline',
      'journal-outline',
      'reader-outline',
      'terminal-outline',
      'server-outline',
      'bug-outline',
      'cog-outline',
      'settings-outline',
      'build-outline',
      'hammer-outline',
      'wrench-outline',
      'flash-outline',
      'trending-up-outline',
      'stats-chart-outline',
      'bar-chart-outline',
      'pie-chart-outline',
    ],
    colors: [
      '#216e39', // Dark Green
      '#45b7d1', // Blue
      '#6c5ce7', // Purple
      '#3742fa', // Bright Blue
      '#1e90ff', // Dodger Blue
      '#4169e1', // Royal Blue
      // NEW LEARNING COLORS:
      '#191970', // Midnight Blue
      '#483d8b', // Dark Slate Blue
      '#6a5acd', // Slate Blue
      '#9370db', // Medium Purple
      '#ba55d3', // Medium Orchid
      '#8a2be2', // Blue Violet
      '#4b0082', // Indigo
    ],
  },
  {
    category: 'Lifestyle & Personal',
    icons: [
      'home-outline',
      'cafe-outline',
      'restaurant-outline',
      'pizza-outline',
      'wine-outline',
      'bed-outline',
      'moon-outline',
      'sunny-outline',
      'shirt-outline',
      'cut-outline',
      'gift-outline',
      'watch-outline',
      // NEW LIFESTYLE ICONS:
      'fast-food-outline',
      'beer-outline',
      'rose-outline',
      'diamond-outline',
      'bag-outline',
      'basket-outline',
      'car-outline',
      'key-outline',
      'lock-closed-outline',
      'umbrella-outline',
      'glasses-outline',
      'telescope-outline',
      'footsteps-outline',
      'train-outline',
      'subway-outline',
      'bus-outline',
      'bicycle-outline',
      'wallet-outline',
      'card-outline',
      'cash-outline',
      'receipt-outline',
    ],
    colors: [
      '#f9ca24', // Yellow
      '#f0932b', // Orange
      '#fd79a8', // Pink
      '#ffa502', // Bright Orange
      '#ff6348', // Coral
      '#ff8c00', // Dark Orange
      '#ff1493', // Deep Pink
      // NEW LIFESTYLE COLORS:
      '#ffd700', // Gold
      '#ffb347', // Peach
      '#ff7f50', // Coral
      '#dda0dd', // Plum
      '#f0e68c', // Khaki
      '#f5deb3', // Wheat
      '#ffe4b5', // Moccasin
      '#ffefd5', // Papaya Whip
    ],
  },
  {
    category: 'Creative & Entertainment',
    icons: [
      'brush-outline',
      'musical-notes-outline',
      'camera-outline',
      'game-controller-outline',
      'tv-outline',
      'headset-outline',
      'flower-outline',
      'construct-outline',
      'hammer-outline',
      'extension-puzzle-outline',
      // NEW CREATIVE ICONS:
      'color-palette-outline',
      'pencil-outline',
      'create-outline',
      'image-outline',
      'images-outline',
      'videocam-outline',
      'film-outline',
      'mic-outline',
      'musical-note-outline',
      'piano-outline',
      'radio-outline',
      'volume-high-outline',
      'play-outline',
      'pause-outline',
      'stop-outline',
      'recording-outline',
      'library-outline',
      'book-outline',
      'journal-outline',
      'newspaper-outline',
      'chatbubble-outline',
      'heart-outline',
      'star-outline',
      'happy-outline',
      'theater-outline',
    ],
    colors: [
      '#eb4d4b', // Dark Red
      '#4ecdc4', // Cyan
      '#9932cc', // Dark Orchid
      '#00ced1', // Dark Turquoise
      '#dc143c', // Crimson
      // NEW CREATIVE COLORS:
      '#ff69b4', // Hot Pink
      '#ff1493', // Deep Pink
      '#da70d6', // Orchid
      '#ee82ee', // Violet
      '#dda0dd', // Plum
      '#e6e6fa', // Lavender
      '#00ffff', // Cyan
      '#40e0d0', // Turquoise
      '#48d1cc', // Medium Turquoise
      '#afeeee', // Pale Turquoise
    ],
  },
  {
    category: 'Social & Travel',
    icons: [
      'people-outline',
      'airplane-outline',
      'car-outline',
      'train-outline',
      'phone-portrait-outline',
      'hand-right-outline',
      'paw-outline',
      'leaf-outline',
      'rainy-outline',
      'thunderstorm-outline',
      'snow-outline',
      // NEW SOCIAL & TRAVEL ICONS:
      'chatbubbles-outline',
      'mail-outline',
      'call-outline',
      'videocam-outline',
      'location-outline',
      'map-outline',
      'compass-outline',
      'navigate-outline',
      'globe-outline',
      'earth-outline',
      'boat-outline',
      'bus-outline',
      'subway-outline',
      'rocket-outline',
      'trail-sign-outline',
      'camera-outline',
      'image-outline',
      'heart-outline',
      'thumbs-up-outline',
      'share-outline',
      'flag-outline',
      'home-outline',
      'business-outline',
      'storefront-outline',
      'restaurant-outline',
      'cafe-outline',
      'wine-outline',
      'gift-outline',
      'balloon-outline',
      'calendar-outline',
      'time-outline',
    ],
    colors: [
      '#9be9a8', // Light Green
      '#2f3542', // Dark Gray
      '#57606f', // Gray
      // NEW SOCIAL & TRAVEL COLORS:
      '#87ceeb', // Sky Blue
      '#4682b4', // Steel Blue
      '#5f9ea0', // Cadet Blue
      '#708090', // Slate Gray
      '#778899', // Light Slate Gray
      '#b0c4de', // Light Steel Blue
      '#e0e0e0', // Light Gray
      '#d3d3d3', // Light Gray
      '#c0c0c0', // Silver
      '#a9a9a9', // Dark Gray
      '#808080', // Gray
      '#696969', // Dim Gray
      '#2e8b57', // Sea Green
      '#3cb371', // Medium Sea Green
      '#66cdaa', // Medium Aquamarine
    ],
  },
  {
    category: 'Goals & Achievements',
    icons: [
      'star-outline',
      'flame-outline',
      'trending-up-outline',
      'checkmark-circle-outline',
      'medal-outline',
      'trophy-outline',
      'stopwatch-outline',
      'alarm-outline',
      'calendar-outline',
      'flash-outline',
      'eye-outline',
      'refresh-outline',
      'repeat-outline',
      'shuffle-outline',
      // NEW GOALS & ACHIEVEMENTS ICONS:
      'ribbon-outline',
      'shield-outline',
      'diamond-outline',
      'crown-outline',
      'flag-outline',
      'rocket-outline',
      'arrow-up-outline',
      'trending-up-outline',
      'stats-chart-outline',
      'bar-chart-outline',
      'pie-chart-outline',
      'analytics-outline',
      'pulse-outline',
      'heart-outline',
      'thumbs-up-outline',
      'hand-right-outline',
      'finger-print-outline',
      'key-outline',
      'lock-open-outline',
      'unlock-outline',
      'telescope-outline',
      'search-outline',
      'compass-outline',
      'navigate-outline',
      'location-outline',
      'pin-outline',
      'bookmark-outline',
      'star-half-outline',
      'infinite-outline',
    ],
    colors: [
      '#f9ca24', // Yellow (Gold)
      '#ff6b6b', // Red
      '#40c463', // Green
      '#6c5ce7', // Purple
      // NEW ACHIEVEMENT COLORS:
      '#ffd700', // Gold
      '#ffdf00', // Golden Yellow
      '#ffed4e', // Bright Yellow
      '#fff200', // Electric Yellow
      '#ffa500', // Orange
      '#ff8c00', // Dark Orange
      '#ff4500', // Orange Red
      '#ff0000', // Red
      '#dc143c', // Crimson
      '#b22222', // Fire Brick
      '#8b0000', // Dark Red
      '#4b0082', // Indigo
      '#6a0dad', // Blue Violet
      '#9400d3', // Violet
      '#8a2be2', // Blue Violet
    ],
  },
  {
    category: 'Nature & Mindfulness',
    icons: [
      'leaf-outline',
      'flower-outline',
      'rose-outline',
      'tree-outline',
      'partly-sunny-outline',
      'cloudy-outline',
      'rainy-outline',
      'snow-outline',
      'thunderstorm-outline',
      'water-outline',
      'flame-outline',
      'earth-outline',
      'moon-outline',
      'sunny-outline',
      'sparkles-outline',
      'heart-outline',
      'infinite-outline',
      'eye-outline',
      'hand-left-outline',
      'accessibility-outline',
      'body-outline',
      'happy-outline',
      'sad-outline',
      'library-outline',
      'book-outline',
      'journal-outline',
      'cafe-outline',
      'wine-outline',
      'musical-note-outline',
      'headset-outline',
      'bed-outline',
      'home-outline',
      'telescope-outline',
      'binoculars-outline',
      'camera-outline',
    ],
    colors: [
      '#228b22', // Forest Green
      '#32cd32', // Lime Green
      '#90ee90', // Light Green
      '#98fb98', // Pale Green
      '#00ff7f', // Spring Green
      '#00fa9a', // Medium Spring Green
      '#7fffd4', // Aquamarine
      '#40e0d0', // Turquoise
      '#48d1cc', // Medium Turquoise
      '#00ced1', // Dark Turquoise
      '#5f9ea0', // Cadet Blue
      '#4682b4', // Steel Blue
      '#87ceeb', // Sky Blue
      '#b0e0e6', // Powder Blue
      '#add8e6', // Light Blue
      '#87cefa', // Light Sky Blue
      '#6495ed', // Cornflower Blue
      '#4169e1', // Royal Blue
      '#0000ff', // Blue
      '#dda0dd', // Plum
      '#e6e6fa', // Lavender
      '#f0e68c', // Khaki
      '#f5deb3', // Wheat
      '#ffefd5', // Papaya Whip
    ],
  },
];

// Flatten all icons and colors for backward compatibility
export const ALL_ICONS = ICON_THEMES.flatMap(theme => theme.icons);
export const ALL_COLORS = [...new Set(ICON_THEMES.flatMap(theme => theme.colors))];

// Helper function to get icons by category
export const getIconsByCategory = (category: string): string[] => {
  const theme = ICON_THEMES.find(t => t.category === category);
  return theme ? theme.icons : [];
};

// Helper function to get colors by category
export const getColorsByCategory = (category: string): string[] => {
  const theme = ICON_THEMES.find(t => t.category === category);
  return theme ? theme.colors : [];
};

// Custom icon suggestions based on habit name
export const suggestIconsForHabit = (habitName: string): string[] => {
  const name = habitName.toLowerCase();
  
  // Fitness & Health suggestions
  if (name.includes('exercise') || name.includes('workout') || name.includes('gym') || name.includes('fitness')) {
    return getIconsByCategory('Fitness & Health');
  }
  if (name.includes('water') || name.includes('drink') || name.includes('hydrate')) {
    return ['water-outline', 'cafe-outline', 'nutrition-outline'];
  }
  if (name.includes('sleep') || name.includes('rest') || name.includes('bed')) {
    return ['bed-outline', 'moon-outline', 'timer-outline'];
  }
  
  // Learning & Work suggestions
  if (name.includes('read') || name.includes('study') || name.includes('learn') || name.includes('book')) {
    return getIconsByCategory('Learning & Work');
  }
  if (name.includes('code') || name.includes('program') || name.includes('develop') || name.includes('software')) {
    return ['code-outline', 'desktop-outline', 'laptop-outline', 'terminal-outline', 'bug-outline'];
  }
  if (name.includes('work') || name.includes('job') || name.includes('office') || name.includes('meeting')) {
    return ['desktop-outline', 'document-outline', 'clipboard-outline', 'business-outline'];
  }
  
  // Creative & Entertainment suggestions
  if (name.includes('music') || name.includes('play') || name.includes('instrument') || name.includes('song')) {
    return ['musical-notes-outline', 'musical-note-outline', 'piano-outline', 'headset-outline', 'mic-outline'];
  }
  if (name.includes('art') || name.includes('draw') || name.includes('paint') || name.includes('creative')) {
    return getIconsByCategory('Creative & Entertainment');
  }
  if (name.includes('photo') || name.includes('picture') || name.includes('camera')) {
    return ['camera-outline', 'image-outline', 'images-outline'];
  }
  
  // Social & Travel suggestions
  if (name.includes('social') || name.includes('friend') || name.includes('call') || name.includes('message')) {
    return ['people-outline', 'chatbubbles-outline', 'call-outline', 'mail-outline'];
  }
  if (name.includes('travel') || name.includes('trip') || name.includes('vacation') || name.includes('explore')) {
    return getIconsByCategory('Social & Travel');
  }
  
  // Lifestyle & Personal suggestions
  if (name.includes('cook') || name.includes('meal') || name.includes('food') || name.includes('eat')) {
    return ['restaurant-outline', 'pizza-outline', 'cafe-outline', 'fast-food-outline'];
  }
  if (name.includes('clean') || name.includes('organize') || name.includes('home') || name.includes('house')) {
    return ['home-outline', 'basket-outline', 'shirt-outline'];
  }
  if (name.includes('shop') || name.includes('buy') || name.includes('money') || name.includes('budget')) {
    return ['bag-outline', 'basket-outline', 'wallet-outline', 'card-outline', 'cash-outline'];
  }
  
  // Goals & Achievements suggestions
  if (name.includes('goal') || name.includes('achieve') || name.includes('target') || name.includes('complete')) {
    return getIconsByCategory('Goals & Achievements');
  }
  
  // Nature & Mindfulness suggestions
  if (name.includes('meditate') || name.includes('mindful') || name.includes('calm') || name.includes('relax')) {
    return getIconsByCategory('Nature & Mindfulness');
  }
  if (name.includes('nature') || name.includes('outdoor') || name.includes('garden') || name.includes('plant')) {
    return ['leaf-outline', 'flower-outline', 'tree-outline', 'earth-outline'];
  }
  if (name.includes('weather') || name.includes('outside') || name.includes('walk') || name.includes('run')) {
    return ['sunny-outline', 'partly-sunny-outline', 'walk-outline', 'bicycle-outline'];
  }
  
  return ALL_ICONS; // Return all if no specific match
};
