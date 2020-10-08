"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectedUserCredentials = exports.UserCredentials = exports.submitForm = exports.defaultCredentialsProps = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _antd = require("antd");

var _reactRedux = require("react-redux");

var _reduxReducerRegistry = _interopRequireDefault(require("@onaio/redux-reducer-registry"));

var _connectedReducerRegistry = require("@onaio/connected-reducer-registry");

var _HeaderBreadCrumb = require("../HeaderBreadCrumb");

var _store = require("@opensrp/store");

var _keycloakService = require("@opensrp/keycloak-service");

require("../../index.css");

_reduxReducerRegistry["default"].register(_store.reducerName, _store.reducer);

var defaultCredentialsProps = {
  accessToken: '',
  fetchKeycloakUsersCreator: _store.fetchKeycloakUsers,
  keycloakUser: null,
  serviceClass: _keycloakService.KeycloakService
};
exports.defaultCredentialsProps = defaultCredentialsProps;

var submitForm = function submitForm(values, props) {
  var serviceClass = props.serviceClass,
      match = props.match,
      accessToken = props.accessToken;
  var userId = match.params.userId;
  var serve = new serviceClass(accessToken, "/users/".concat(userId, "/reset-password"), 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage');
  var password = values.password,
      temporary = values.temporary;
  serve.update({
    temporary: temporary,
    type: 'password',
    value: password
  }).then(function () {
    _connectedReducerRegistry.history.push('/admin');

    _antd.notification.success({
      message: 'Credentials updated successfully',
      description: ''
    });
  })["catch"](function (_) {
    _antd.notification.error({
      message: 'An error occurred',
      description: ''
    });
  });
};

exports.submitForm = submitForm;

var UserCredentials = function UserCredentials(props) {
  var userId = props.match.params.userId;
  var isEditMode = !!userId;
  var layout = {
    labelCol: {
      span: 4
    },
    wrapperCol: {
      span: 16
    }
  };
  return _react["default"].createElement(_antd.Col, {
    span: 12
  }, _react["default"].createElement(_antd.Card, {
    title: "".concat(isEditMode ? 'Edit User' : 'Create New User'),
    bordered: false
  }, _react["default"].createElement(_HeaderBreadCrumb.HeaderBreadCrumb, {
    userId: userId
  }), _react["default"].createElement("div", {
    className: "form-container"
  }, _react["default"].createElement(_antd.Form, (0, _extends2["default"])({}, layout, {
    onFinish: function onFinish(values) {
      return submitForm(values, props);
    }
  }), _react["default"].createElement(_antd.Form.Item, {
    name: "password",
    label: "Password",
    rules: [{
      required: true,
      message: 'Please input your password!'
    }],
    hasFeedback: true
  }, _react["default"].createElement(_antd.Input.Password, null)), _react["default"].createElement(_antd.Form.Item, {
    name: "confirm",
    label: "Confirm Password",
    dependencies: ['password'],
    hasFeedback: true,
    rules: [{
      required: true,
      message: 'Please confirm your password!'
    }, function (_ref) {
      var getFieldValue = _ref.getFieldValue;
      return {
        validator: function validator(rule, value) {
          if (!value || getFieldValue('password') === value) {
            return Promise.resolve();
          }

          return Promise.reject('The two passwords that you entered do not match!');
        }
      };
    }]
  }, _react["default"].createElement(_antd.Input.Password, null)), _react["default"].createElement(_antd.Form.Item, {
    name: "temporary",
    label: "Temporary",
    valuePropName: "checked"
  }, _react["default"].createElement(_antd.Switch, null)), _react["default"].createElement(_antd.Form.Item, null, _react["default"].createElement(_antd.Row, {
    justify: "start"
  }, _react["default"].createElement(_antd.Col, {
    span: 4
  }, _react["default"].createElement(_antd.Button, {
    htmlType: "submit",
    className: "reset-password"
  }, "Reset Password"))))))));
};

exports.UserCredentials = UserCredentials;
UserCredentials.defaultProps = defaultCredentialsProps;

var mapStateToProps = function mapStateToProps(state, ownProps) {
  var userId = ownProps.match.params.userId;
  var keycloakUsersSelector = (0, _store.makeKeycloakUsersSelector)();
  var keycloakUsers = keycloakUsersSelector(state, {
    id: [userId]
  });
  var keycloakUser = keycloakUsers.length >= 1 ? keycloakUsers[0] : null;
  var accessToken = (0, _store.getAccessToken)(state);
  return {
    keycloakUser: keycloakUser,
    accessToken: accessToken
  };
};

var mapDispatchToProps = {
  fetchKeycloakUsersCreator: _store.fetchKeycloakUsers
};
var ConnectedUserCredentials = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(UserCredentials);
exports.ConnectedUserCredentials = ConnectedUserCredentials;