import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Image, Animated} from 'react-native';

import {images} from '../../utils/images';
import BaseScreen from '../base_screen';

const AnimationScreen = React.memo(() => {
  const initXY = {x: 250, y: -60};
  const midXY = {x: 250, y: 120};
  const finalXY = {x: 10, y: 0};
  const translateXYRef = useRef(new Animated.ValueXY(finalXY)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(translateXYRef, {
        toValue: initXY,
        duration: 1000,
        useNativeDriver: true,
        delay: 1000,
      }),

      Animated.timing(translateXYRef, {
        toValue: midXY,
        duration: 1000,
        useNativeDriver: true,
      }),

      Animated.timing(translateXYRef, {
        toValue: finalXY,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = {
    transform: [
      {
        translateX: translateXYRef.x,
      },
      {
        translateY: translateXYRef.y,
      },
    ],
  };

  return (
    <BaseScreen screenName="AnimationScreen">
      <View style={styles.container}>
        <Image
          source={images.plateCheese}
          style={styles.plateCheese}
          resizeMode="stretch"
        />

        <Animated.Image
          source={images.bug}
          style={[styles.bugContainer, animatedStyle]}
          resizeMode="center"
        />
      </View>
    </BaseScreen>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  plateCheese: {
    width: '100%',
    height: '100%',
  },
  bugContainer: {
    position: 'absolute',
    zIndex: 111,
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: 90,
    left: 0,
    alignSelf: 'center',
  },
  bug: {
    height: 90,
    width: 90,
  },
});

export default AnimationScreen;
