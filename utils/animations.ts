import { Animated, Easing } from 'react-native';

export class AnimationUtils {
  static createSpringAnimation(
    value: Animated.Value,
    toValue: number,
    config?: {
      tension?: number;
      friction?: number;
      useNativeDriver?: boolean;
    }
  ): Animated.CompositeAnimation {
    return Animated.spring(value, {
      toValue,
      tension: config?.tension || 100,
      friction: config?.friction || 8,
      useNativeDriver: config?.useNativeDriver !== false,
    });
  }

  static createTimingAnimation(
    value: Animated.Value,
    toValue: number,
    duration: number = 300,
    easing: (value: number) => number = Easing.out(Easing.cubic),
    useNativeDriver: boolean = true
  ): Animated.CompositeAnimation {
    return Animated.timing(value, {
      toValue,
      duration,
      easing,
      useNativeDriver,
    });
  }

  static createPulseAnimation(
    value: Animated.Value,
    minScale: number = 1,
    maxScale: number = 1.1,
    duration: number = 1000
  ): Animated.CompositeAnimation {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: maxScale,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: minScale,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
  }

  static createBounceAnimation(
    value: Animated.Value,
    bounceHeight: number = 10,
    duration: number = 600
  ): Animated.CompositeAnimation {
    return Animated.sequence([
      Animated.timing(value, {
        toValue: -bounceHeight,
        duration: duration / 4,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 0,
        duration: duration / 4,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: -bounceHeight / 2,
        duration: duration / 4,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 0,
        duration: duration / 4,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]);
  }

  static createFadeInAnimation(
    value: Animated.Value,
    duration: number = 300
  ): Animated.CompositeAnimation {
    return Animated.timing(value, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    });
  }

  static createSlideInAnimation(
    value: Animated.Value,
    fromValue: number,
    toValue: number = 0,
    duration: number = 300
  ): Animated.CompositeAnimation {
    value.setValue(fromValue);
    return Animated.timing(value, {
      toValue,
      duration,
      easing: Easing.out(Easing.back(1.7)),
      useNativeDriver: true,
    });
  }

  static createSuccessAnimation(
    scaleValue: Animated.Value,
    opacityValue: Animated.Value
  ): Animated.CompositeAnimation {
    return Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.3,
          duration: 200,
          easing: Easing.out(Easing.back(2)),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(opacityValue, {
          toValue: 0.7,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]);
  }

  static createShakeAnimation(
    value: Animated.Value,
    intensity: number = 10
  ): Animated.CompositeAnimation {
    return Animated.sequence([
      Animated.timing(value, { toValue: intensity, duration: 50, useNativeDriver: true }),
      Animated.timing(value, { toValue: -intensity, duration: 50, useNativeDriver: true }),
      Animated.timing(value, { toValue: intensity, duration: 50, useNativeDriver: true }),
      Animated.timing(value, { toValue: -intensity, duration: 50, useNativeDriver: true }),
      Animated.timing(value, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]);
  }
}

export default AnimationUtils;
