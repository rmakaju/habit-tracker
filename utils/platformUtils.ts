import { Platform, Dimensions, StatusBar } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Platform-specific constants
export const PlatformConstants = {
  // Touch target sizes
  touchTarget: Platform.select({
    ios: 44,
    android: 48, // Android guidelines recommend 48dp minimum
    web: 32,
  }),
  
  // Typography
  baseFontSize: Platform.select({
    ios: 16,
    android: 16,
    web: 14,
  }),
  
  // Spacing
  baseSpacing: 8,
  
  // Status bar height for proper header positioning
  statusBarHeight: Platform.select({
    ios: 44, // Standard iOS status bar + safe area
    android: StatusBar.currentHeight || 24, // Dynamic Android status bar
    web: 0,
  }),
  
  // Header height for consistent positioning
  headerHeight: Platform.select({
    ios: 60,
    android: 64, // Slightly taller for Android
    web: 56,
  }),
  
  // Border radius
  borderRadius: Platform.select({
    ios: 8,
    android: 4,
    web: 6,
  }),
  
  // Shadow/elevation
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
    web: {
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
  }),
};

// Screen size utilities
export const ScreenUtils = {
  width: screenWidth,
  height: screenHeight,
  isSmallScreen: screenWidth < 375,
  isTablet: screenWidth > 768,
  isDesktop: screenWidth > 1024,
};

// Responsive font sizing with Android optimization
export const responsiveFontSize = (size: number) => {
  const baseSize = PlatformConstants.baseFontSize || 16;
  const scale = size / baseSize;
  
  if (Platform.OS === 'web') {
    // Web: Use CSS rem units equivalent
    return size * 0.875; // Slightly smaller for web
  }
  
  if (Platform.OS === 'android') {
    // Android: Use larger base font and better scaling
    const scaleFactor = ScreenUtils.width / 375; // Base on iPhone X width
    const androidScale = Math.max(1.0, Math.min(1.3, scaleFactor)); // More generous scaling
    return Math.round(size * androidScale);
  }
  
  // iOS: Use responsive scaling
  const scaleFactor = ScreenUtils.width / 375; // Base on iPhone X width
  return Math.round(size * Math.max(0.8, Math.min(1.2, scaleFactor)));
};

// Responsive spacing with Android optimization
export const responsiveSpacing = (multiplier: number) => {
  const baseSpacing = PlatformConstants.baseSpacing;
  
  if (Platform.OS === 'web') {
    return baseSpacing * multiplier;
  }
  
  if (Platform.OS === 'android') {
    // Android: Slightly more generous spacing
    const scaleFactor = ScreenUtils.isTablet ? 1.3 : 1.1;
    return baseSpacing * multiplier * scaleFactor;
  }
  
  // iOS: Standard responsive spacing
  const scaleFactor = ScreenUtils.isTablet ? 1.2 : 1;
  return baseSpacing * multiplier * scaleFactor;
};

// Platform-specific button styles with Android optimization
export const createButtonStyle = (variant: 'primary' | 'secondary' | 'text' = 'primary') => {
  const baseStyle = {
    minHeight: PlatformConstants.touchTarget,
    minWidth: Platform.select({ android: 64, default: 44 }), // Wider buttons on Android
    paddingHorizontal: responsiveSpacing(2),
    paddingVertical: responsiveSpacing(Platform.OS === 'android' ? 2 : 1.5),
    borderRadius: PlatformConstants.borderRadius,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    ...PlatformConstants.shadow,
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyle,
        backgroundColor: '#007AFF',
      };
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: Platform.select({ android: 2, default: 1 }), // Thicker borders on Android
        borderColor: '#007AFF',
      };
    case 'text':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
        boxShadow: 'none',
        minWidth: Platform.select({ android: 48, default: 32 }), // Still accessible on Android
      };
    default:
      return baseStyle;
  }
};

// Safe area handling
export const SafeAreaUtils = {
  // For web, we don't need safe area insets
  getInsets: () => Platform.select({
    web: { top: 0, bottom: 0, left: 0, right: 0 },
    default: null, // Will use actual safe area insets on mobile
  }),
};

// Animation configurations
export const AnimationConfig = {
  // Use native driver when possible for better performance
  timing: {
    useNativeDriver: Platform.OS !== 'web',
    duration: 300,
  },
  spring: {
    useNativeDriver: Platform.OS !== 'web',
    tension: 100,
    friction: 7,
  },
};

// Input configurations
export const InputConfig = {
  autoCapitalize: Platform.select({
    ios: 'sentences' as const,
    android: 'sentences' as const,
    web: 'off' as const, // Web handles this differently
  }),
  autoCorrect: Platform.OS !== 'web',
  spellCheck: Platform.OS !== 'web',
};

// Android-specific calendar utilities
export const CalendarConfig = {
  // Minimum cell size for Android touch targets
  minCellSize: Platform.select({
    android: 16,
    default: 12,
  }),
  
  // Grid spacing for better Android layout
  gridSpacing: Platform.select({
    android: 8,
    default: 6,
  }),
  
  // Header spacing for Android status bar
  headerTopPadding: Platform.select({
    android: 24,
    ios: 20,
    default: 16,
  }),
};

export default {
  PlatformConstants,
  ScreenUtils,
  responsiveFontSize,
  responsiveSpacing,
  createButtonStyle,
  SafeAreaUtils,
  AnimationConfig,
  InputConfig,
  CalendarConfig,
};
