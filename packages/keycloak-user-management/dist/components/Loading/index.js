"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.defaultProps = void 0;

var _react = _interopRequireDefault(require("react"));

require("../../index.css");

var defaultProps = {
  borderColor: '#ff5d00',
  borderStyle: 'solid',
  borderWidth: '4px',
  height: '64px',
  minHeight: '80vh',
  width: '64px'
};
exports.defaultProps = defaultProps;

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
  return _react.default.createElement("div", {
    className: "lds-ripple-parent",
    style: {
      minHeight: minHeight
    }
  }, _react.default.createElement("div", {
    className: "lds-ripple",
    style: {
      height: height,
      width: width
    }
  }, _react.default.createElement("div", {
    style: innerDivStyle
  }), _react.default.createElement("div", {
    style: innerDivStyle
  })));
};

Ripple.defaultProps = defaultProps;
var _default = Ripple;
exports.default = _default;