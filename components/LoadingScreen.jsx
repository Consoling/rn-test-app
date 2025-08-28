import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  Easing,
} from 'react-native';
import COLORS from '../constants/colors';


const { width, height } = Dimensions.get('window');

export default function LoadingScreen({ message = "Loading..." }) {
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous spinning animation
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Pulse animation for dots
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    );

    spinAnimation.start();
    pulseAnimation.start();

    return () => {
      spinAnimation.stop();
      pulseAnimation.stop();
    };
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeValue,
            transform: [{ scale: scaleValue }],
          },
        ]}
      >
        {/* Main Loading Spinner */}
        <View style={styles.spinnerContainer}>
          <Animated.View
            style={[
              styles.spinner,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          >
            <View style={styles.spinnerRing} />
          </Animated.View>
          
          {/* Inner pulsing dot */}
          <Animated.View
            style={[
              styles.centerDot,
              {
                transform: [{ scale: pulseValue }],
              },
            ]}
          />
        </View>

        {/* Loading Text */}
        <Animated.Text
          style={[
            styles.loadingText,
            {
              opacity: fadeValue,
            },
          ]}
        >
          {message}
        </Animated.Text>

        {/* Animated Dots */}
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((index) => (
            <AnimatedDot key={index} delay={index * 200} />
          ))}
        </View>
      </Animated.View>

      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        {Array.from({ length: 12 }, (_, i) => (
          <View
            key={i}
            style={[
              styles.backgroundCircle,
              {
                top: Math.random() * height,
                left: Math.random() * width,
                animationDelay: `${Math.random() * 2}s`,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

// Animated Dot Component
function AnimatedDot({ delay = 0 }) {
  const bounceValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: 1,
          duration: 400,
          delay,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(bounceValue, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.in(Easing.ease),
        }),
      ])
    );

    bounceAnimation.start();

    return () => bounceAnimation.stop();
  }, [delay]);

  const translateY = bounceValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          transform: [{ translateY }],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  spinnerContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  spinner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: COLORS.primary,
    borderRightColor: COLORS.primary,
    position: 'absolute',
  },
  spinnerRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: COLORS.textSecondary,
    borderLeftColor: COLORS.textSecondary,
    position: 'absolute',
    top: 7,
    left: 7,
  },
  centerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    position: 'absolute',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  backgroundCircle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.border,
    opacity: 0.3,
  },
});

// Usage example:
// <LoadingScreen message="Authenticating..." />
// <LoadingScreen /> // Uses default "Loading..." message