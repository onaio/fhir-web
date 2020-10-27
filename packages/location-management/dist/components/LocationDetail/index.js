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
      lastupdated = props.lastupdated,
      status = props.status,
      type = props.type,
      created = props.created,
      externalid = props.externalid,
      openmrsid = props.openmrsid,
      username = props.username,
      version = props.version,
      level = props.level;
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
  }, status)), React.createElement("div", {
    className: "mb-4 small"
  }, React.createElement("p", {
    className: "mb-0 font-weight-bold"
  }, "Type"), React.createElement("p", {
    className: "mb-0 loc-desc"
  }, type)), React.createElement("div", {
    className: "mb-4 small"
  }, React.createElement("p", {
    className: "mb-0 font-weight-bold"
  }, "Created"), React.createElement("p", {
    className: "mb-0 loc-desc"
  }, created.toLocaleDateString('en-US'))), React.createElement("div", {
    className: "mb-4 small"
  }, React.createElement("p", {
    className: "mb-0 font-weight-bold"
  }, "Last updated"), React.createElement("p", {
    className: "mb-0 loc-desc"
  }, lastupdated.toLocaleDateString('en-US'))), React.createElement("div", {
    className: "mb-4 small"
  }, React.createElement("p", {
    className: "mb-0 font-weight-bold"
  }, "External Id"), React.createElement("p", {
    className: "mb-0 loc-desc"
  }, externalid)), React.createElement("div", {
    className: "mb-4 small"
  }, React.createElement("p", {
    className: "mb-0 font-weight-bold"
  }, "OpenMRS Id"), React.createElement("p", {
    className: "mb-0 loc-desc"
  }, openmrsid)), React.createElement("div", {
    className: "mb-4 small"
  }, React.createElement("p", {
    className: "mb-0 font-weight-bold"
  }, "Username"), React.createElement("p", {
    className: "mb-0 loc-desc"
  }, username)), React.createElement("div", {
    className: "mb-4 small"
  }, React.createElement("p", {
    className: "mb-0 font-weight-bold"
  }, "Version"), React.createElement("p", {
    className: "mb-0 loc-desc"
  }, version)), React.createElement("div", {
    className: "mb-4 small"
  }, React.createElement("p", {
    className: "mb-0 font-weight-bold"
  }, "Sync status"), React.createElement("p", {
    className: "mb-0 loc-desc"
  }, status)), React.createElement("div", {
    className: "mb-4 small"
  }, React.createElement("p", {
    className: "mb-0 font-weight-bold"
  }, "Level"), React.createElement("p", {
    className: "mb-0 loc-desc"
  }, level)));
};

var _default = LocationDetail;
exports["default"] = _default;