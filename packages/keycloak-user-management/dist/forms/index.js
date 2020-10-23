'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.UserForm = exports.handleUserActionsChange = exports.defaultProps = exports.defaultInitialValues = void 0;

var _extends2 = _interopRequireDefault(require('@babel/runtime/helpers/extends'));

var _defineProperty2 = _interopRequireDefault(require('@babel/runtime/helpers/defineProperty'));

var _slicedToArray2 = _interopRequireDefault(require('@babel/runtime/helpers/slicedToArray'));

var _react = _interopRequireDefault(require('react'));

var _antd = require('antd');

var _connectedReducerRegistry = require('@onaio/connected-reducer-registry');

var _keycloakService = require('@opensrp/keycloak-service');

var _constants = require('../constants');

var _utils = require('./utils');

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        (0, _defineProperty2['default'])(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}

var defaultInitialValues = {
  access: {
    manageGroupMembership: false,
    view: false,
    mapRoles: false,
    impersonate: false,
    manage: false,
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
  username: '',
};
exports.defaultInitialValues = defaultInitialValues;
var defaultProps = {
  accessToken: '',
  initialValues: defaultInitialValues,
  serviceClass: _keycloakService.KeycloakService,
};
exports.defaultProps = defaultProps;

var handleUserActionsChange = function handleUserActionsChange(selected, setRequiredActions) {
  setRequiredActions(selected);
};

exports.handleUserActionsChange = handleUserActionsChange;

var UserForm = function UserForm(props) {
  var initialValues = props.initialValues,
    serviceClass = props.serviceClass,
    accessToken = props.accessToken,
    keycloakBaseURL = props.keycloakBaseURL;

  var _React$useState = _react['default'].useState([]),
    _React$useState2 = (0, _slicedToArray2['default'])(_React$useState, 2),
    requiredActions = _React$useState2[0],
    setRequiredActions = _React$useState2[1];

  var _React$useState3 = _react['default'].useState([]),
    _React$useState4 = (0, _slicedToArray2['default'])(_React$useState3, 2),
    userActionOptions = _React$useState4[0],
    setUserActionOptions = _React$useState4[1];

  var _React$useState5 = _react['default'].useState(false),
    _React$useState6 = (0, _slicedToArray2['default'])(_React$useState5, 2),
    isSubmitting = _React$useState6[0],
    setIsSubmitting = _React$useState6[1];

  var layout = {
    labelCol: {
      xs: {
        offset: 0,
        span: 16,
      },
      sm: {
        offset: 2,
        span: 10,
      },
      md: {
        offset: 0,
        span: 8,
      },
      lg: {
        offset: 0,
        span: 6,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 14,
      },
      md: {
        span: 12,
      },
      lg: {
        span: 10,
      },
    },
  };
  var tailLayout = {
    wrapperCol: {
      xs: {
        offset: 0,
        span: 16,
      },
      sm: {
        offset: 12,
        span: 24,
      },
      md: {
        offset: 8,
        span: 16,
      },
      lg: {
        offset: 6,
        span: 14,
      },
    },
  };
  var Option = _antd.Select.Option;

  _react['default'].useEffect(
    function () {
      (0, _utils.fetchRequiredActions)(
        accessToken,
        keycloakBaseURL,
        setUserActionOptions,
        serviceClass
      );
    },
    [accessToken, keycloakBaseURL, serviceClass]
  );

  _react['default'].useEffect(
    function () {
      setRequiredActions(initialValues.requiredActions ? initialValues.requiredActions : []);
    },
    [initialValues.requiredActions]
  );

  return _react['default'].createElement(
    'div',
    {
      className: 'form-container',
    },
    _react['default'].createElement(
      _antd.Form,
      (0, _extends2['default'])(
        {
          initialValues: initialValues,
        },
        layout,
        {
          onFinish: function onFinish(values) {
            (0, _utils.submitForm)(
              _objectSpread(
                _objectSpread({}, values),
                {},
                {
                  requiredActions: requiredActions,
                }
              ),
              accessToken,
              keycloakBaseURL,
              serviceClass,
              setIsSubmitting,
              initialValues.id
            );
          },
        }
      ),
      _react['default'].createElement(
        _antd.Form.Item,
        {
          label: 'First Name',
          name: 'firstName',
          hasFeedback: true,
          rules: [
            {
              required: true,
              message: 'First Name required',
              whitespace: true,
            },
          ],
        },
        _react['default'].createElement(_antd.Input, null)
      ),
      _react['default'].createElement(
        _antd.Form.Item,
        {
          label: 'Last Name',
          name: 'lastName',
          hasFeedback: true,
          rules: [
            {
              required: true,
              message: 'Last Name required',
              whitespace: true,
            },
          ],
        },
        _react['default'].createElement(_antd.Input, null)
      ),
      _react['default'].createElement(
        _antd.Form.Item,
        {
          label: 'Username',
          name: 'username',
          hasFeedback: true,
          rules: [
            {
              required: true,
              message: 'Username required',
              whitespace: true,
            },
          ],
        },
        _react['default'].createElement(_antd.Input, {
          disabled: initialValues.id ? true : false,
        })
      ),
      _react['default'].createElement(
        _antd.Form.Item,
        {
          label: 'Email',
          name: 'email',
          hasFeedback: true,
          rules: [
            {
              required: true,
              message: 'Email required',
              whitespace: true,
            },
          ],
        },
        _react['default'].createElement(_antd.Input, null)
      ),
      _react['default'].createElement(
        _antd.Form.Item,
        {
          name: 'requiredActions',
          label: 'Required User Actions',
        },
        _react['default'].createElement(
          _antd.Select,
          {
            mode: 'multiple',
            allowClear: true,
            placeholder: 'Please select',
            onChange: function onChange(selected) {
              return handleUserActionsChange(selected, setRequiredActions);
            },
            style: {
              width: '100%',
            },
          },
          userActionOptions.map(function (option, index) {
            return _react['default'].createElement(
              Option,
              {
                key: ''.concat(index),
                value: option.alias,
              },
              option.name
            );
          })
        )
      ),
      _react['default'].createElement(
        _antd.Form.Item,
        tailLayout,
        _react['default'].createElement(
          _antd.Button,
          {
            type: 'primary',
            htmlType: 'submit',
            className: 'create-user',
          },
          isSubmitting ? 'Saving' : 'Save'
        ),
        _react['default'].createElement(
          _antd.Button,
          {
            htmlType: 'submit',
            onClick: function onClick() {
              return _connectedReducerRegistry.history.push(_constants.URL_ADMIN);
            },
            className: 'cancel-user',
          },
          'Cancel'
        )
      )
    )
  );
};

exports.UserForm = UserForm;
UserForm.defaultProps = defaultProps;
