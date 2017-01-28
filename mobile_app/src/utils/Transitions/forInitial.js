function forInitial(props): Object {
  const {
    navigationState,
    scene,
  } = props;

  const focused = navigationState.index === scene.index;
  const opacity = focused ? 1 : 0;
  // If not focused, move the scene to the far away.
  const dir = scene.index > navigationState.index ? 1 : -1;
  const translate = focused ? 0 : (1000000 * dir);
  return {
    opacity,
    transform: [
      { translateX: translate },
      { translateY: translate },
    ],
  };
}

export default forInitial;