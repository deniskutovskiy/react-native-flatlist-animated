import { Animated } from "react-native";

export interface IAnimationSelection {
  entering: keyof typeof EnteringAnimations;
  exiting: keyof typeof ExitingAnimations;
  reordering: keyof typeof ReorderingAnimations | "none";
  transition: "spring" | "timing";
}

export interface IAnimationProps {
  progress: Animated.Value;
  enterProgress: Animated.Value | Animated.AnimatedInterpolation;
  exitProgress: Animated.Value | Animated.AnimatedInterpolation;
  enterTransitionProgress: Animated.Value;
  exitTransitionProgress: Animated.Value;
  enterDuration: number;
  exitDuration: number;
  translateFrom: number;
  translateTo: number;
  containerHeight: number;
  invertedFactor: 1 | -1;
  horizontal: boolean;
  horizontalSlideRange: number
}

export const EnteringAnimations = {
  slideInLeft: (props: IAnimationProps, selection?: IAnimationSelection) => {
    const translateY = 0;
    const translateX = props.enterProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [props.horizontalSlideRange, 0],
      extrapolate: "clamp",
    });
    return { transform: [{ translateX }, { translateY }] };
  },
  slideInRight: (props: IAnimationProps, selection?: IAnimationSelection) => {
    const translateY = 0;
    const translateX = props.enterProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [-props.horizontalSlideRange, 0],
      extrapolate: "clamp",
    });
    return { transform: [{ translateX }, { translateY }] };
  },
  fadeIn: (props: IAnimationProps, selection?: IAnimationSelection) => {
    const opacity = props.enterProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    return { opacity };
  },
  zoomIn: (props: IAnimationProps, selection?: IAnimationSelection) => {
    const opacity = props.enterProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    return { opacity, transform: [{ scale: opacity }] };
  },
};

export const ExitingAnimations = {
  slideOutLeft: (props: IAnimationProps, selection?: IAnimationSelection) => {
    const translateX = props.exitProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -props.horizontalSlideRange],
      extrapolate: "clamp",
    });
    return { transform: [{ translateX }] };
  },
  slideOutRight: (props: IAnimationProps, selection?: IAnimationSelection) => {
    const translateX = props.exitProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, props.horizontalSlideRange],
      extrapolate: "clamp",
    });
    return { transform: [{ translateX }] };
  },
  fadeOut: (props: IAnimationProps, selection?: IAnimationSelection) => {
    const opacity = props.exitProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });
    return { opacity };
  },
  zoomOut: (props: IAnimationProps, selection?: IAnimationSelection) => {
    const opacity = props.exitProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });
    return { opacity, transform: [{ scale: opacity }] };
  },
};

export const LayoutTransitions = {
  vertical: (props: IAnimationProps, selection?: IAnimationSelection) => {
    const diff = props.translateFrom - props.translateTo;
    let translateY: Animated.AnimatedInterpolation | number;
    if (diff < 0) {
      translateY = props.enterTransitionProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [diff * props.containerHeight * props.invertedFactor, 0],
      });
    } else if (diff > 0) {
      translateY = props.exitTransitionProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [diff * props.containerHeight * props.invertedFactor, 0],
      });
    } else {
      translateY = 0;
    }

    return { transform: [{ translateY }] };
  },

  horizontal: () => {
    return { transform: null };
  },
};

export const ReorderingAnimations = {
  zoomOut: (props: IAnimationProps, selection?: IAnimationSelection) => {
    const totalDuration = props.enterDuration + props.exitDuration;
    const exitPeriod = props.exitDuration / totalDuration;

    let scale: Animated.AnimatedInterpolation | number;
    let translateY: Animated.AnimatedInterpolation | number;
    let opacity: Animated.AnimatedInterpolation | number;

    const diff = props.translateFrom - props.translateTo;

    if (diff > 0) {
      scale = props.progress.interpolate({
        inputRange: [0, exitPeriod / 2, 1],
        outputRange: [1, 0, 1],
        extrapolate: "clamp",
      });
      opacity = props.progress.interpolate({
        inputRange: [0, exitPeriod, 1],
        outputRange: [1, 0, 1],
      });
    } else if (diff < 0) {
      scale = 1;
      opacity = 1;
    } else {
      scale = 1;
      opacity = 1;
    }

    scale = props.progress.interpolate({
      inputRange: [0, exitPeriod / 2, 1],
      outputRange: [1, 0, 1],
      extrapolate: "clamp",
    });

    let { transform } =
      LayoutTransitions[props.horizontal ? "horizontal" : "vertical"](props);
    translateY = transform[0].translateY;

    return { transform: [{ translateY }, { scale }], opacity };
  },

  translateOnly: (props: IAnimationProps, selection?: IAnimationSelection) => {
    let translateY: Animated.AnimatedInterpolation;
    const totalDuration = props.enterDuration + props.exitDuration;
    const exitPeriod = props.exitDuration / totalDuration;
    const opacity = props.progress.interpolate({
      inputRange: [0, exitPeriod, 1],
      outputRange: [1, 0, 1],
    });
    const { transform } =
      LayoutTransitions[props.horizontal ? "horizontal" : "vertical"](props);
    translateY = transform[0].translateY;

    return { opacity, transform: [{ translateY }] };
  },
};
