"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ripple = exports.defaultRippleProps = void 0;

var _react = _interopRequireDefault(require("react"));

require("./style.css");

var defaultRippleProps = {
  borderColor: '#ff5d00',
  borderStyle: 'solid',
  borderWidth: '4px',
  height: '64px',
  minHeight: '80vh',
  width: '64px'
};
exports.defaultRippleProps = defaultRippleProps;

var Ripple = function Ripple(props) {
  var borderColor = props.borderColor,
      borderStyle = props.borderStyle,
      borderWidth = props.borderWidth,
      height = props.height,
      minHeight = props.minHeight,
      width = props.width;
  var innerDivStyle = {
    borderColor: borderColor,
    borderStyle: borderStyle,
    borderWidth: borderWidth
  };
  return _react["default"].createElement("div", {
    className: "lds-ripple-parent",
    style: {
      minHeight: minHeight
    }
  }, _react["default"].createElement("div", {
    className: "lds-ripple",
    style: {
      height: height,
      width: width
    }
  }, _react["default"].createElement("div", {
    style: innerDivStyle
  }), _react["default"].createElement("div", {
    style: innerDivStyle
  })));
};

exports.Ripple = Ripple;
Ripple.defaultProps = defaultRippleProps;