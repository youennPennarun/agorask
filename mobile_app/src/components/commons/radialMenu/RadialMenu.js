/* @flow */

import React from 'react';
import { View, PanResponder, Animated, TouchableOpacity, StyleSheet} from 'react-native';

import animations from './animations';

type StateType = {
  showIcons: boolean,
  masterX: number,
  masterY: number,
  itemsAnims: Animated[],
  initialPosition: Object,
};
type OnMainButtonLayoutParamsType = {x:number, y: number, height: number, width: number};
/*
Usage:
          <RadialMenu ref='menu'
            icon='md-clock'
            showIcons={this.state.showMenu}
            startAngle={0}
            endAngle={360}
            style={{
              zIndex: 55,
              position: 'absolute',
              top: 50,
              left: 150,
            }} >
              <View callback={() => console.log('I am the red ranger!') } style={{width: 25, height: 25, backgroundColor: 'red'}} />
              <View callback={() => console.log('I am the green ranger!') } style={{width: 25, height: 25, backgroundColor: 'green'}} />
              <View callback={() => console.log('I am the blue ranger!') } style={{width: 25, height: 25, backgroundColor: 'blue'}} />
              <View style={{width: 25, height: 25, backgroundColor: 'yellow'}} />
            </RadialMenu>
*/

/**
 * Object representing an item's hitbox
 * x: top left X position
 * y: top left Y position
 * size: item radius
 * callback: function to call on press
 */
class Item {
  id: number;
  box: {
    x1: number,
    x2: number,
    y1: number,
    y2: number,
  };
  callback: Function;
  constructor(id: number,
    x: number,
    y: number,
    size: number,
    callback: Function = (): null => null,
  ) {
    this.id = id;
    this.box = {
      x1: x - (size / 2),
      y1: y - (size / 2),
      x2: x + (size / 2),
      y2: y + (size / 2),
    };
    this.callback = callback;
  }

  include(x, y): boolean {
    const {x1, x2, y1, y2} = this.box;
    return (x >= x1 && y >= y1 && x <= x2 && y <= y2);
  }

  call() {
    // eslint-disable-next-line no-unused-expressions
    this.callback && this.callback();
  }
}

export default class RadialMenu extends React.Component {

  /* eslint-disable react/sort-comp */
  static defaultProps = {
    icon: 'md-more',
    showIconsOn: 'press',
    onPress: (): null => null,
    mainButtonSize: 60,
    itemsSize: 60,
    startAngle: 180,
    endAngle: 85,
    radius: 10,
    style: {},
    onMenuWillShow: () => null,
    onMenuDidHide: () => null,
    itemsStyle: {},
  }

  itemsHitBoxes: Item[] = [];
  selected: ?Item = undefined;
  _panResponder: PanResponder;
  master: View;

  state: StateType = {
    showIcons: false,
    masterX: 0,
    masterY: 0,
    itemsAnims: [],
    initialPosition: {},
  }

  /* eslint-enable react/sort-comp */

  constructor(props: any) {
    super(props);
  }
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState): boolean =>
        this._handleMoveShouldSetPanResponder(e, gestureState),
      onPanResponderGrant: (e, gestureState): any =>
        this._handlePanResponderGrant(e, gestureState),
      onPanResponderMove: (e, gestureState): any =>
        this._handlePanResponderMove(e, gestureState),
      onPanResponderRelease: (e, gestureState): any =>
        this._handlePanResponderRelease(e, gestureState),
    });
  }

  componentWillUpdate(nextProps: any) {
    /* Update items position relative to the main button */
    if (this.props.showIcons !== nextProps.showIcons) {
      if (nextProps.showIcons) {
        this.showIcons();
      } else {
        this.hideIcons();
      }
    }
  }
  onPress() {
    const {showIconsOn, onPress} = this.props;
    if (showIconsOn === 'press') {
      if (this.state.showIcons) {
        this.hideIcons();
        return;
      }
      this.showIcons();
      return;
    }
    // eslint-disable-next-line no-unused-expressions
    onPress && onPress();
  }
  onLongPress() {
    const {showIconsOn, onLongPress} = this.props;
    if (showIconsOn === 'longPress') {
      if (this.state.showIcons) {
        this.hideIcons();
        return;
      }
      this.showIcons();
      return;
    }
    // eslint-disable-next-line no-unused-expressions
    onLongPress && onLongPress();
  }

  _getRelativeTouchPosition(evt: Object, gestureState): {x: number, y: number} {
    const {locationX, locationY} = evt.nativeEvent;
    const {dx, dy} = gestureState;
    const {masterX, masterY} = this.state;
    /* Checking if hovering an item */
    const x = masterX + (locationX, dx);
    const y = masterY + (locationY, dy);
    return {
      x,
      y,
    };
  }
  _handleMoveShouldSetPanResponder(): boolean {
    return this.state.showIcons && this.props.showIconsOn === 'longPress';
  }
  _handlePanResponderGrant() {
    this.showIcons();
  }
  _handlePanResponderMove(e, gestureState) {
    /* Checking if hovering an item */
    const {x, y} = this._getRelativeTouchPosition(e, gestureState);
    const nextSelected: ?Item = this.itemsHitBoxes.find(
      (item: Item): boolean => item.include(x, y),
    );
    if (this.selected !== nextSelected) { // If hovering on a different element
      if (this.selected) { // If was hovering on an element
        // Animating the old eleemnt to his idle state
        animations.blur(this.state.itemsAnims[this.selected.id]);
      }
      if (nextSelected) {
        // Animating the old eleemnt to his selected state
        animations.focus(this.state.itemsAnims[nextSelected.id]);
      }
      this.selected = nextSelected;
    }
  }
  _handlePanResponderRelease(e, gestureState) {
    const {x, y} = this._getRelativeTouchPosition(e, gestureState);
    const selected = this.itemsHitBoxes.find((item: Item): boolean => item.include(x, y));
    // eslint-disable-next-line no-unused-expressions
    selected && selected.call();
    this.hideIcons();
    this.selected = undefined;
  }

  _buildItemsInitialState(initialPosition: {top: number, left: number}): Object[] {
    const {children} = this.props;
    return children.map((): Object => ({
      scale: new Animated.Value(0.1),
      opacity: new Animated.Value(0),
      top: new Animated.Value(initialPosition.top),
      left: new Animated.Value(initialPosition.left),
    }));
  }

  _onMainButtonLayout({x, y, height, width}: OnMainButtonLayoutParamsType) {
    const {itemsSize} = this.props;
    const masterX = x + (width / 2);
    const masterY = y + (height / 2);
    if (this.state.masterX === masterX && this.state.masterY === masterY) return;
    const initialPosition = {
      top: masterY - (itemsSize / 2),
      left: masterX - (itemsSize / 2),
    };
    this.setState({
          masterX,
          masterY,
          initialPosition,
          itemsAnims: this._buildItemsInitialState(initialPosition),
    });
  }

  showIcons() {
    if (!this.state.showIcons) {
      this.props.onMenuWillShow();
      this._buildIcons();
      this.setState({
        showIcons: true,
      });
    }
  }

  hideIcons() {
    if (this.state.showIcons) {
      this.props.onMenuDidHide();
      this.setState({
        showIcons: false,
      });
        animations.hide(this.state.itemsAnims, this.state.initialPosition);
    }
  }

  _calculateEndPositions(): [{top: number, left: number}] {
    const {children, itemsSize, radius, startAngle, endAngle} = this.props;
    const extRadius = radius + itemsSize;
    const anglePadding = (endAngle - startAngle) / (Math.max(1, children.length));

    return children.map((_: any, key: number): {top: number, left: number} => {
      const degrees = startAngle + (anglePadding * key);
      const rad = degrees * (Math.PI / 180);
      const top = this.state.masterY + (extRadius * Math.cos(rad));
      const left = this.state.masterX + (extRadius * Math.sin(rad));

      return {
        top,
        left,
      };
    });
  }

  _buildIcons() {
    const {children, itemsSize} = this.props;
    this.itemsHitBoxes = [];
    const endPositions = this._calculateEndPositions();
    const visiblePositions = [];
    children.forEach((child, key) => {
      const {left, top} = endPositions[key];
      this.itemsHitBoxes.push(new Item(key, left, top, itemsSize, children[key].props.callback));
      visiblePositions.push({
        top: top - (itemsSize / 2),
        left: left - (itemsSize / 2),
      });
    });
    animations.show(this.state.itemsAnims, visiblePositions);
  }

  _renderItems(): any {
    const {children, itemsSize, itemsStyle} = this.props;
    if (children.length !== this.state.itemsAnims.length) return null;
    return children.map((item, i): any => (
      <Animated.View key={i}
        style={[
          styles.item,
          itemsStyle,
          {
            height: itemsSize,
            width: itemsSize,
            borderRadius: itemsSize / 2,
            top: this.state.itemsAnims[i].top,
            left: this.state.itemsAnims[i].left,
            opacity: this.state.itemsAnims[i].opacity,
            transform: [{ scale: this.state.itemsAnims[i].scale }],
        },
      ]}>
        <TouchableOpacity onPress={() => {
          if (item.props.callback) item.props.callback();
        }} >
        {item}
        </TouchableOpacity>
      </Animated.View>

    ));
  }

  _renderMainButton(): any {
    const {mainButtonSize, renderMainButton} = this.props;
    if (renderMainButton) return renderMainButton();
    return (
      <View style={{
        width: mainButtonSize,
        height: mainButtonSize,
        backgroundColor: 'white',
        borderRadius: mainButtonSize / 2,
      }} />
    );
  }

  _itemOnPress(item) {
    // eslint-disable-next-line no-unused-expressions
    item.callback && item.callback();
    this.hideIcons();
  }

  render(): any {
    return (
      <View {...this._panResponder.panHandlers} >
        {this._renderItems()}
        <TouchableOpacity ref={master => { this.master = master; }}
          onLayout={({nativeEvent}) => { this._onMainButtonLayout(nativeEvent.layout); }}
          style={{...this.props.style}}
          delayLongPress={this.props.delayLongPress}
          onPress={(): any => this.onPress()}
          onLongPress={(): any => this.onLongPress()}>
          {this._renderMainButton()}
        </TouchableOpacity>
      </View>
      );
  }
}
RadialMenu.propTypes = {
  style: React.PropTypes.object,
  icon: React.PropTypes.string,
  mainButtonSize: React.PropTypes.number,
  showIconsOn: React.PropTypes.oneOf(['press', 'longPress']),
  delayLongPress: React.PropTypes.number,
  onPress: React.PropTypes.func,
  itemsSize: React.PropTypes.number,
  startAngle: React.PropTypes.number,
  endAngle: React.PropTypes.number,
  radius: React.PropTypes.number,
  onMenuWillShow: React.PropTypes.func,
  onMenuDidHide: React.PropTypes.func,
};


const styles = StyleSheet.create({
  text: {
    color: 'red',
  },
  mainButton: {
    alignItems: 'center',
    textAlign: 'center',
    height: 40,
    justifyContent: 'center',
  },
  item: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
