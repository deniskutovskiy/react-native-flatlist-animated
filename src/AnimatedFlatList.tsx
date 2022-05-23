import * as React from 'react';
import { useEffect, useRef, ForwardedRef, useLayoutEffect } from 'react';
import { Animated, FlatListProps, FlatList, Dimensions } from 'react-native';
import { IAnimationSelection } from './Animations';
import { AnimatedItem } from './AnimatedItem';

interface ITimingConfig {
  useNativeDriver?: Animated.TimingAnimationConfig['useNativeDriver'];
  easing?: Animated.TimingAnimationConfig['easing'];
  isInteraction?: Animated.TimingAnimationConfig['isInteraction'];
}

interface ISpringConfig {
  bounciness?: Animated.SpringAnimationConfig['bounciness'];
  damping?: Animated.SpringAnimationConfig['damping'];
  friction?: Animated.SpringAnimationConfig['friction'];
  isInteraction?: Animated.SpringAnimationConfig['isInteraction'];
  mass?: Animated.SpringAnimationConfig['mass'];
  overshootClamping?: Animated.SpringAnimationConfig['overshootClamping'];
  restDisplacementThreshold?: Animated.SpringAnimationConfig['restDisplacementThreshold'];
  speed?: Animated.SpringAnimationConfig['speed'];
  stiffness?: Animated.SpringAnimationConfig['stiffness'];
  tension?: Animated.SpringAnimationConfig['tension'];
  useNativeDriver?: Animated.SpringAnimationConfig['useNativeDriver'];
  velocity?: Animated.SpringAnimationConfig['velocity'];
}

interface AnimatedFlatListProps {
  data: { key: string; value: any }[];
  renderItem({ item, index, separators }): any;
  itemContainerHeight: number;
  inverted?: boolean;
  entering?: IAnimationSelection['entering'];
  exiting?: IAnimationSelection['exiting'];
  transition?: IAnimationSelection['transition'];
  timingConfig?: ITimingConfig;
  springConfig?: ISpringConfig;
  reordering?: IAnimationSelection['reordering'] | 'none';
  enterDuration?: number;
  exitDuration?: number;
  horizontalSlideRange?: number;
}

const AnimatedFlatList = React.forwardRef(
  (
    {
      data,
      renderItem,
      itemContainerHeight,
      inverted = false,
      entering = 'zoomIn',
      exiting = 'zoomOut',
      reordering = 'translateOnly',
      transition = 'spring',
      timingConfig,
      springConfig,
      enterDuration = 250,
      exitDuration = 250,
      horizontal,
      horizontalSlideRange = Dimensions.get('window').width,
      keyExtractor = (item: { [key: string]: any }, index: number) => {
        if (item.key && typeof item.key === 'string') return item.key;
        if (item.id && typeof item.id === 'string') return item.id;
        return index.toString();
      },
      ...otherProps
    }: FlatListProps<any> & AnimatedFlatListProps,
    ref: ForwardedRef<FlatList<any>>,
  ) => {
    const oldData = useRef(data);
    useEffect(() => {
      if (oldData.current.length >= data.length)
        data = data.filter((item, index) => !keyExtractor(item, index).includes('---empty---'));
      oldData.current = data;
    });

    const keys: string[] = data.map((item, index) => keyExtractor(item, index));
    const oldKeys: string[] = oldData.current.map((item, index) => keyExtractor(item, index));

    const progress = useRef(new Animated.Value(1)).current;
    const enterProgress = useRef(new Animated.Value(1)).current;
    const exitProgress = useRef(new Animated.Value(1)).current;

    const enterTransitionProgress = useRef(new Animated.Value(1)).current;
    const exitTransitionProgress = useRef(new Animated.Value(1)).current;

    useLayoutEffect(() => {
      progress.setValue(0);
      enterProgress.setValue(0);
      enterTransitionProgress.setValue(0);
      exitProgress.setValue(0);
      exitTransitionProgress.setValue(0);

      let transitionAnim: (value: Animated.Value, duration: number, delay: number) => Animated.CompositeAnimation;

      switch (transition) {
        case 'spring': {
          transitionAnim = (value, _duration, delay) =>
            Animated.spring(value, {
              damping: 10,
              mass: 1,
              stiffness: 100,
              overshootClamping: false,
              restDisplacementThreshold: 0.001,
              restSpeedThreshold: 0.001,
              ...springConfig,
              toValue: 1,
              delay,
              useNativeDriver: true,
            });
          break;
        }
        case 'timing': {
          transitionAnim = (value, duration, delay) =>
            Animated.timing(value, {
              ...timingConfig,
              useNativeDriver: true,
              toValue: 1,
              duration,
              delay,
            });
        }
      }

      Animated.parallel(
        [
          Animated.timing(progress, {
            toValue: 1,
            duration: enterDuration + exitDuration,
            useNativeDriver: true,
          }),
          transitionAnim(enterTransitionProgress, exitDuration, 0),
          Animated.timing(enterProgress, {
            toValue: 1,
            duration: enterDuration,
            delay: exitDuration,
            useNativeDriver: true,
          }),
          Animated.timing(exitProgress, {
            toValue: 1,
            duration: exitDuration,
            delay: 0,
            useNativeDriver: true,
          }),
          transitionAnim(exitTransitionProgress, enterDuration, exitDuration),
        ],
        { stopTogether: false },
      ).start();
    });

    // console.log("Animated Flatlist");
    const renderAnimatedItem = ({ item, index, separators }) => {
      const hasExitingValue: boolean = oldKeys[index] && !keys.includes(oldKeys[index]);
      const hasEnteringValue: boolean = !oldKeys.includes(keyExtractor(item, index));

      let translateFrom: number;
      const translateTo: number = index;

      if (!hasEnteringValue) {
        translateFrom = oldKeys.findIndex((key) => key === keyExtractor(item, index));
      } else {
        translateFrom = index;
      }

      // check reordering condition
      let shouldSwapValue: boolean = false;
      if (!hasExitingValue && !hasEnteringValue) {
        const condition1 = reordering !== 'none';
        const condition2 = translateFrom > translateTo;
        const condition3 = keys[translateFrom] != null;
        const condition4 = () => {
          let count = 0;
          for (let i = 0; i < translateTo; i++) {
            if (!keys.includes(oldKeys[i])) {
              count++;
            }
          }
          return count !== translateFrom - translateTo;
        };

        if (condition1 && condition2 && condition3 && condition4()) {
          shouldSwapValue = true;
        }
      }

      // console.log("Render Item", index);

      let prevChildren: JSX.Element = null;
      if (hasExitingValue && oldData.current[index]) {
        prevChildren = renderItem({
          item: oldData.current[index],
          index,
          separators,
        });
      }

      let children: JSX.Element;
      if (keyExtractor(item, index).includes('---empty---')) {
        children = null;
      } else {
        children = renderItem({ item, index, separators });
      }

      return (
        <AnimatedItem
          progress={progress}
          enterProgress={enterProgress}
          exitProgress={exitProgress}
          enterTransitionProgress={enterTransitionProgress}
          exitTransitionProgress={exitTransitionProgress}
          enterDuration={enterDuration}
          exitDuration={exitDuration}
          selection={{ entering, exiting, reordering, transition }}
          containerHeight={itemContainerHeight}
          invertedFactor={inverted ? -1 : 1}
          hasEnteringValue={hasEnteringValue}
          hasExitingValue={hasExitingValue}
          shouldSwapValue={shouldSwapValue}
          translateFrom={translateFrom}
          translateTo={translateTo}
          prevChildren={prevChildren}
          children={children}
          horizontal={horizontal}
          horizontalSlideRange={Math.abs(horizontalSlideRange)}
        />
      );
    };

    if (oldData.current.length > data.length) {
      if (oldKeys.join(',').includes(keys.join(','))) {
        let emptySlots = new Array(oldKeys.length - keys.length).fill(0);
        emptySlots = emptySlots.map((_item, index) => {
          return { key: '---empty---#' + index, value: null };
        });
        data = [...data, ...emptySlots];
      }
    }

    return (
      <FlatList
        {...otherProps}
        ref={ref}
        data={data}
        renderItem={renderAnimatedItem}
        keyExtractor={(_item, index) => index.toString()}
        inverted={inverted}
        horizontal={horizontal}
      />
    );
  },
);

export default AnimatedFlatList;
