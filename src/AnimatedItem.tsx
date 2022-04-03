import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import {
  EnteringAnimations,
  ExitingAnimations,
  IAnimationProps,
  IAnimationSelection,
  LayoutTransitions,
  ReorderingAnimations,
} from './Animations';

interface IAnimatedItemProps {
  children: JSX.Element;
  prevChildren: JSX.Element;
  hasEnteringValue: boolean;
  hasExitingValue: boolean;
  shouldSwapValue: boolean;
  containerHeight: number;
  selection: IAnimationSelection;
}

export function AnimatedItem({
  children,
  prevChildren,
  hasEnteringValue,
  hasExitingValue,
  shouldSwapValue,
  selection,
  ...animationProps
}: IAnimatedItemProps & IAnimationProps) {
  const [showPrevious, setShowPrevious] = useState(false);
  const showRef = useRef(false);
  const isExiting = useRef(false);
  isExiting.current = hasExitingValue;
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    const listener = animationProps.exitProgress.addListener(({ value }) => {
      if (value >= 1) {
        if (showRef.current && isMounted.current) {
          setShowPrevious(false);
          // console.log("showPrevious is changed to false");
          showRef.current = false;
        }
      } else if (value === 0 && !isExiting.current) {
        if (showRef.current && isMounted.current) {
          setShowPrevious(false);
          showRef.current = false;
        }
      } else {
        if (!showRef.current && isExiting.current && isMounted.current) {
          setShowPrevious(true);
          // console.log("showPrevious is changed to true");
          showRef.current = true;
        }
      }
    });

    return () => {
      isMounted.current = false;
      animationProps.progress.removeListener(listener);
    };
  }, []);

  let enterStyles;
  let exitStyles;
  let swapStyles;
  let translateStyles;

  if (hasEnteringValue) {
    enterStyles = EnteringAnimations[selection.entering](animationProps, selection);
  } else {
    if (selection.reordering !== 'none' && shouldSwapValue) {
      swapStyles = ReorderingAnimations[selection.reordering](animationProps, selection);
    } else {
      translateStyles = LayoutTransitions[animationProps.horizontal ? 'horizontal' : 'vertical'](
        animationProps,
        selection,
      );
    }
  }

  if (hasExitingValue) {
    exitStyles = ExitingAnimations[selection.exiting](animationProps, selection);
  }

  // showPrevious &&
  //   console.log(
  //     "SLOT NO: ",
  //     animationProps.translateTo,
  //     "PLAYS UNMOUNTING ANIMATION"
  //   );

  // shouldSwapValue &&
  //   console.log(
  //     "SLOT NO: ",
  //     animationProps.translateTo,
  //     "PLAYS SWAPPING ANIMATION"
  //   );

  return (
    <>
      <Animated.View
        style={[
          { height: animationProps.containerHeight, overflow: 'hidden' },
          translateStyles,
          swapStyles,
          enterStyles,
        ]}
      >
        {children}
      </Animated.View>
      {hasExitingValue && showPrevious && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: '100%',
              height: animationProps.containerHeight,
              overflow: 'hidden',
            },
            exitStyles,
          ]}
        >
          {prevChildren}
        </Animated.View>
      )}
    </>
  );
}
