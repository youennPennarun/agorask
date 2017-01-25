import forInitial from './forInitial';


function forVertical(props): Object {
  const {
    layout,
    position,
    scene,
  } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }

  const index = scene.index;
  const inputRange = [index - 1, index, index + 1];
  const height = layout.initHeight;

  const opacity = position.interpolate({
    inputRange,
    outputRange: ([1, 1, 0.3]),
  });

  const scale = position.interpolate({
    inputRange,
    outputRange: ([1, 1, 0.95]),
  });

  const translateX = 0;
  const translateY = position.interpolate({
    inputRange,
    outputRange: ([height, 0, -10]),
  });
  return {
    opacity,
    transform: [
      { scale },
      { translateX },
      { translateY },
    ],
  };
}

export default forVertical;
