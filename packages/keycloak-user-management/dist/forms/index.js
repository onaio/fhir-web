"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserForm = exports.handleUserActionsChange = exports.userSchema = exports.defaultProps = exports.defaultInitialValues = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _formik = require("formik");

var _react = _interopRequireDefault(require("react"));

var _antd = require("antd");

var Yup = _interopRequireWildcard(require("yup"));

var _connectedReducerRegistry = require("@onaio/connected-reducer-registry");

var _keycloakService = require("@opensrp/keycloak-service");

var _constants = require("../constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var defaultInitialValues = {
  access: {
    manageGroupMembership: false,
    view: false,
    mapRoles: false,
    impersonate: false,
    manage: false
  },
  createdTimestamp: undefined,
  disableableCredentialTypes: [],
  email: '',
  emailVerified: false,
  enabled: true,
  firstName: '',
  id: '',
  lastName: '',
  notBefore: 0,
  requiredActions: [],
  totp: false,
  username: ''
};
exports.defaultInitialValues = defaultInitialValues;
var defaultProps = {
  accessToken: 'hunter 2',
  initialValues: defaultInitialValues,
  serviceClass: _keycloakService.KeycloakService
};
exports.defaultProps = defaultProps;
var userSchema = Yup.object().shape({
  lastName: Yup.string().required('Required'),
  firstName: Yup.string().required('Required')
});
exports.userSchema = userSchema;

var handleUserActionsChange = function handleUserActionsChange(selected, setRequiredActions) {
  setRequiredActions(selected);
};

exports.handleUserActionsChange = handleUserActionsChange;

var UserForm = function UserForm(props) {
  var initialValues = props.initialValues,
      serviceClass = props.serviceClass,
      accessToken = props.accessToken;

  var _React$useState = _react["default"].useState([]),
      _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
      requiredActions = _React$useState2[0],
      setRequiredActions = _React$useState2[1];

  var _React$useState3 = _react["default"].useState([]),
      _React$useState4 = (0, _slicedToArray2["default"])(_React$useState3, 2),
      userActionOptions = _React$useState4[0],
      setUserActionOptions = _React$useState4[1];

  var isEditMode = initialValues.id !== '';
  var layout = {
    labelCol: {
      xs: {
        offset: 0,
        span: 16
      },
      sm: {
        offset: 2,
        span: 10
      },
      md: {
        offset: 0,
        span: 8
      },
      lg: {
        offset: 0,
        span: 6
      }
    },
    wrapperCol: {
      xs: {
        span: 24
      },
      sm: {
        span: 14
      },
      md: {
        span: 12
      },
      lg: {
        span: 10
      }
    }
  };
  var tailLayout = {
    wrapperCol: {
      xs: {
        offset: 0,
        span: 16
      },
      sm: {
        offset: 12,
        span: 24
      },
      md: {
        offset: 8,
        span: 16
      },
      lg: {
        offset: 6,
        span: 14
      }
    }
  };
  var Option = _antd.Select.Option;

  _react["default"].useEffect(function () {
    var serve = new serviceClass(accessToken, "/authentication/required-actions/", 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage');
    serve.list().then(function (response) {
      setUserActionOptions(response.filter(function (action) {
        return action.alias !== 'terms_and_conditions';
      }));
    })["catch"](function (err) {
      _antd.notification.error({
        message: "".concat(err),
        description: ''
      });
    });
  });

  return _react["default"].createElement("div", {
    className: "form-container"
  }, _react["default"].createElement(_formik.Formik, {
    initialValues: initialValues,
    validationSchema: userSchema,
    onSubmit: function onSubmit(values, _ref) {
      var setSubmitting = _ref.setSubmitting;

      if (isEditMode) {
        var serve = new serviceClass(accessToken, "/users/".concat(initialValues.id), 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage');
        serve.update(_objectSpread(_objectSpread({}, values), {}, {
          requiredActions: requiredActions
        })).then(function () {
          setSubmitting(false);

          _connectedReducerRegistry.history.push('/admin');

          _antd.notification.success({
            message: 'User edited successfully',
            description: ''
          });
        })["catch"](function (e) {
          _antd.notification.error({
            message: "".concat(e),
            description: ''
          });

          setSubmitting(false);
        });
      } else {
        var _serve = new serviceClass(accessToken, '/users', 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage');

        _serve.create(values).then(function () {
          setSubmitting(false);

          _connectedReducerRegistry.history.push('/admin');

          _antd.notification.success({
            message: 'User created successfully',
            description: ''
          });
        })["catch"](function (e) {
          _antd.notification.error({
            message: "".concat(e),
            description: ''
          });

          setSubmitting(false);
        });
      }
    }
  }, function (_ref2) {
    var errors = _ref2.errors,
        isSubmitting = _ref2.isSubmitting,
        handleSubmit = _ref2.handleSubmit;
    return _react["default"].createElement(_antd.Form, (0, _extends2["default"])({
      initialValues: initialValues
    }, layout, {
      onSubmitCapture: handleSubmit
    }), _react["default"].createElement(_antd.Form.Item, {
      label: 'First Name',
      rules: [{
        required: true,
        message: 'Please input your First Name!',
        whitespace: true
      }]
    }, _react["default"].createElement(_formik.Field, {
      type: "text",
      name: "firstName",
      id: "firstName",
      className: errors.firstName ? "form-control is-invalid" : "form-control"
    })), _react["default"].createElement(_antd.Form.Item, {
      label: 'Last Name',
      rules: [{
        required: true,
        message: 'Please input your Last Name!',
        whitespace: true
      }]
    }, _react["default"].createElement(_formik.Field, {
      type: "text",
      name: "lastName",
      id: "lastName",
      className: errors.lastName ? "form-control is-invalid" : "form-control"
    }), _react["default"].createElement(_formik.ErrorMessage, {
      name: "lastName",
      component: "small",
      className: "form-text text-danger name-error"
    })), _react["default"].createElement(_antd.Form.Item, {
      label: 'Username'
    }, _react["default"].createElement(_formik.Field, {
      readOnly: isEditMode,
      type: "text",
      name: "username",
      id: "username",
      className: errors.username ? "form-control is-invalid" : "form-control"
    }), _react["default"].createElement(_formik.ErrorMessage, {
      component: "small",
      name: "username",
      className: "form-text text-danger username-error"
    })), _react["default"].createElement(_antd.Form.Item, {
      label: 'Email'
    }, _react["default"].createElement(_formik.Field, {
      type: "text",
      name: "email",
      id: "email",
      className: errors.email ? "form-control is-invalid" : "form-control"
    }), _react["default"].createElement(_formik.ErrorMessage, {
      component: "small",
      name: "email",
      className: "form-text text-danger username-error"
    })), _react["default"].createElement(_antd.Form.Item, {
      name: "requiredActions",
      label: 'Required User Actions'
    }, _react["default"].createElement(_antd.Select, {
      mode: "multiple",
      allowClear: true,
      placeholder: "Please select",
      onChange: function onChange(selected) {
        return handleUserActionsChange(selected, setRequiredActions);
      },
      style: {
        width: '100%'
      }
    }, userActionOptions.map(function (option, index) {
      return _react["default"].createElement(Option, {
        key: "".concat(index),
        value: option.alias
      }, option.name);
    }))), _react["default"].createElement(_antd.Form.Item, tailLayout, _react["default"].createElement(_antd.Button, {
      htmlType: "submit",
      onClick: function onClick() {
        return _connectedReducerRegistry.history.push(_constants.ADMIN_URL);
      },
      className: "cancel-user",
      disabled: isSubmitting || Object.keys(errors).length > 0
    }, "Cancel"), _react["default"].createElement(_antd.Button, {
      type: "primary",
      htmlType: "submit",
      className: "create-user",
      disabled: isSubmitting || Object.keys(errors).length > 0
    }, isSubmitting ? 'Saving' : 'Save User')));
  }));
};

exports.UserForm = UserForm;
UserForm.defaultProps = defaultProps;