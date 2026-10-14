import React, {useEffect, useRef} from 'react';
import {Animated, type StyleProp, type ViewStyle} from 'react-native';
import {useTheme} from '../theme';

interface SkeletonProps {
  width?: ViewStyle['width'];
  height: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

/** A softly pulsing placeholder block shown while content loads. */
export function Skeleton({
  width = '100%',
  height,
  radius,
  style,
}: SkeletonProps) {
  const {theme} = useTheme();
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius ?? theme.radius.sm,
          backgroundColor: theme.colors.surfaceAlt,
          opacity,
        },
        style,
      ]}
    />
  );
}
