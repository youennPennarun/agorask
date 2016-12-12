const React = require('react');

const RNMK = jest.genMockFromModule('react-native-material-kit');



RNMK.MKButton = {
  ...RNMK.MKButton,
  coloredButton: function() {
    function withText() { return this; }
    function withStyle() { return this; }
    const build = () => React.createClass({ displayName: 'MKButton', render: () => null});
    return {
      withText,
      withStyle,
      build,
    };
  },
};

function tfBuilder() {
  function withPlaceholder() { return this; }
  function withUnderlineEnabled() { return this; }
  function withHighlightColor() { return this; }
  function withStyle() { return this; }
  const build = () => React.createClass({ displayName: 'MKTextField', render: () => null});
  return {
    withPlaceholder,
    withUnderlineEnabled,
    withHighlightColor,
    withStyle,
    build,
  };
}

RNMK.MKTextField = {
  ...RNMK.MKButton,
  textfieldWithFloatingLabel: tfBuilder,
  textfield: tfBuilder,
};


module.exports = RNMK;
