"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _icons = require("@ant-design/icons");

var _antd = require("antd");

require("./LocationDetail.css");

var LocationDetail = function LocationDetail(props) {
  var name = props.name,
      active = props.active,
      description = props.description;
  console.log('res', props.active);
  return React.createElement("div", {
    className: "p-4 bg-white"
  }, React.createElement(_antd.Button, {
    shape: "circle",
    onClick: function onClick() {
      return props.onClose ? props.onClose() : '';
    },
    className: "float-right",
    type: "text",
    icon: React.createElement(_icons.CloseOutlined, null)
  }), React.createElement("div", {
    className: "mb-4 small mt-4"
  }, React.createElement("p", {
    className: "mb-0 font-weight-bold"
  }, "Name"), React.createElement("p", {
    className: "mb-0 loc-desc"
  }, name)), React.createElement("div", {
    className: "mb-4 small"
  }, React.createElement("p", {
    className: "mb-0 font-weight-bold"
  }, "Status"), React.createElement("p", {
    className: "mb-0 loc-desc"
  }, "".concat(active))), React.createElement("div", {
    className: "mb-4 small"
  }, React.createElement("p", {
    className: "mb-0 font-weight-bold"
  }, "Description"), React.createElement("p", {
    className: "mb-0 loc-desc"
  }, description)));
};

var _default = LocationDetail;
exports["default"] = _default;