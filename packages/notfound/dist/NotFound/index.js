"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _antd = require("antd");

var _react = _interopRequireDefault(require("react"));

var _reactRouter = require("react-router");

NotFound.defaultProps = {
  title: '404',
  subTitle: 'Sorry, the page you are trying to visit does not exist.'
};

function NotFound(props) {
  var history = (0, _reactRouter.useHistory)();
  return _react["default"].createElement(_antd.Result, {
    status: "404",
    title: props.title,
    subTitle: props.subTitle,
    extra: _react["default"].createElement(_react["default"].Fragment, null, "asdsadaS", _react["default"].createElement(_antd.Button, {
      key: "home",
      onClick: function onClick() {
        return history.push(props.pathtoredirectto);
      },
      type: "primary"
    }, "Back Home"))
  });
}

var _default = NotFound;
exports["default"] = _default;