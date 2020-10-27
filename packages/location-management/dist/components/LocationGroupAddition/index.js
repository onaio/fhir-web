"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectedLocationUnitGroupAdd = exports.LocationUnitGroupAdd = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactHelmet = require("react-helmet");

var _store = require("@opensrp/store");

var _reactRedux = require("react-redux");

var _Form = _interopRequireDefault(require("./Form"));

var LocationUnitGroupAdd = function LocationUnitGroupAdd(props) {
  return _react["default"].createElement("section", null, _react["default"].createElement(_reactHelmet.Helmet, null, _react["default"].createElement("title", null, "Add Location Unit Group")), _react["default"].createElement("h5", {
    className: "mb-3"
  }, "Add Location Unit Group"), _react["default"].createElement("div", {
    className: "bg-white p-5"
  }, _react["default"].createElement(_Form["default"], {
    keycloakUsers: props.keycloakUsers,
    accessToken: props.accessToken
  })));
};

exports.LocationUnitGroupAdd = LocationUnitGroupAdd;

var mapStateToProps = function mapStateToProps(state, _) {
  var keycloakUsers = (0, _store.getKeycloakUsersArray)(state);
  var accessToken = (0, _store.getAccessToken)(state);
  return {
    keycloakUsers: keycloakUsers,
    accessToken: accessToken
  };
};

var mapDispatchToProps = {};
var ConnectedLocationUnitGroupAdd = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(LocationUnitGroupAdd);
exports.ConnectedLocationUnitGroupAdd = ConnectedLocationUnitGroupAdd;