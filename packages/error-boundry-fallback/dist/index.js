"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _antd = require("antd");

var _reactRouter = require("react-router");

var Fallback = function Fallback() {
  var history = (0, _reactRouter.useHistory)();
  return React.createElement(_antd.Result, {
    status: "error",
    title: "An Error Occurred",
    subTitle: "There has been an error. It\u2019s been reported to the site administrators via email and should be fixed shortly. Thanks for your patience.",
    extra: React.createElement(_antd.Button, {
      id: "backHome",
      key: "error",
      onClick: function onClick() {
        return history.push('/');
      },
      type: "primary"
    }, "Back Home")
  });
};

var _default = Fallback;
exports["default"] = _default;