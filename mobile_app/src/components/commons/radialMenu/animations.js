/* @flow */
import { Animated} from 'react-native';

function focus(item: Object) {
  Animated.spring(item.scale, {
    toValue: 1.3,
    tension: 60,
    friction: 10,
  }).start();
}
function blur(item: Object) {
  Animated.spring(item.scale, {
    toValue: 1,
    tension: 60,
    friction: 10,
  }).start();
}

function hide(items: Array<Object>, hiddenPosition: Object) {
  items.forEach(item => {
    Animated.parallel([
      Animated.spring(item.top, {
        toValue: hiddenPosition.top,
        tension: 60,
        friction: 10,
      }), Animated.spring(item.left, {
        toValue: hiddenPosition.left,
        tension: 60,
        friction: 10,
      }), Animated.spring(item.scale, {
        toValue: 0.1,
        tension: 60,
        friction: 10,
      }), Animated.timing(item.opacity, {
        toValue: 0,
        duration: 500,
      }),
    ]).start();
  });
}
function show(items: Array<Object>, visiblePositions: Array<Object>) {
  Animated.stagger(100, items.map((item: Object, key: number) => {
    const {left, top} = visiblePositions[key];
    return Animated.parallel([
        Animated.spring(item.top, {
          toValue: top,
          tension: 60,
          friction: 10,
        }), Animated.spring(item.left, {
          toValue: left,
          tension: 60,
          friction: 10,
        }), Animated.spring(item.scale, {
          toValue: 1,
          tension: 60,
          friction: 10,
        }), Animated.spring(item.opacity, {
          toValue: 1,
          tension: 60,
          friction: 10,
        }),
      ]);
    })).start();
}

export default {
  focus,
  blur,
  hide,
  show,
};
