import {Animated} from "react-native";

/**
 * A simple method for a fade-in effect
 *
 * @param animation The value that is to be animated
 * @param duration The duration of the animation in milliseconds
 * */
export const fadeIn = (animation: Animated.Value, duration: number = 400) => {
  return Animated.timing(animation, {
    toValue: 1,
    duration: duration,
    useNativeDriver: true,
  });
};

/**
 * A simple method for a fade-in effect
 *
 * @param animation The value that is to be animated
 * @param duration The duration of the animation in milliseconds
 */
export const fadeOut = (animation: Animated.Value, duration: number = 400) => {
  return Animated.timing(animation, {
    toValue: 0,
    duration: duration,
    useNativeDriver: true,
  });
};
