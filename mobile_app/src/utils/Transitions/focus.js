import forInitial from './forInitial';

function focus(props): Object {
  const {
    layout,
    position,
    scene,
  } = props;
  const initialPosition = scene.route.position || {y: 0};
  
  const index = scene.index;
  const inputRange = [index - 1, index, index + 1];
  const height = layout.initHeight;

  const opacity = position.interpolate({
    inputRange,
    outputRange: ([1, 1, 0]),
  });

  const scale = position.interpolate({
    inputRange,
    outputRange: ([1, 1, 0.95]),
  });

  const translateX = 0;
  const translateY = position.interpolate({
    inputRange,
    outputRange: ([initialPosition.y, 0, -10]),
  });
  return {
    opacity,
    transform: [
      { scale: 1 },
      { translateX },
      { translateY },
    ],
  };
}

export default focus;
