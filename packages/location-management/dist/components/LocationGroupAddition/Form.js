"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Form = exports.userSchema = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _formik = require("formik");

var Yup = _interopRequireWildcard(require("yup"));

var _react = _interopRequireDefault(require("react"));

var _formikAntd = require("formik-antd");

var _antd = require("antd");

var _connectedReducerRegistry = require("@onaio/connected-reducer-registry");

var _serverService = require("@opensrp/server-service");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 8
  }
};
var offsetLayout = {
  wrapperCol: {
    offset: 8,
    span: 8
  }
};
var validateMessages = {
  required: '${label} is required!',
  number: {
    len: 'lenth should be ${label}',
    min: 'should be greater than ${label}',
    max: 'should be lesser than ${label}',
    range: '${label} must be between ${min} and ${max}'
  },
  "default": '${label} defauslt',
  "enum": '${label} enum',
  whitespace: '${label} whitespace',
  date: {
    format: '${label} format',
    parse: '${label} parse',
    invalid: '${label} invalid'
  },
  types: {
    string: '${label} is not a valid string',
    method: '${label} is not a valid method',
    array: '${label} is not a valid array',
    object: '${label} is not a valid object',
    number: '${label} is not a valid number',
    date: '${label} is not a valid date',
    "boolean": '${label} is not a valid boolean',
    integer: '${label} is not a valid integer',
    "float": '${label} is not a valid float',
    regexp: '${label} is not a valid regexp',
    email: '${label} is not a valid email',
    url: '${label} is not a valid url',
    hex: '${label} is not a valid hex'
  },
  string: {
    len: '${label} len',
    min: '${label} min',
    max: '${label} max',
    range: '${label} range'
  },
  array: {
    len: '${label} len',
    min: '${label} min',
    max: '${label} max',
    range: '${label} range'
  },
  pattern: {
    mismatch: '${label} mismatch'
  }
};
var location = [{
  name: 'Option 1',
  value: 'Option1'
}, {
  name: 'Option 2',
  value: 'Option2'
}, {
  name: 'Option 3',
  value: 'Option3'
}];
var status = [{
  label: 'Active',
  value: 'active'
}, {
  label: 'Inactive',
  value: 'inactive'
}];
var initialValue = {
  name: null,
  type: null,
  status: 'active'
};
var userSchema = Yup.object().shape({
  name: Yup.string().typeError('Name must be a String').required('Name is Required'),
  status: Yup.string().typeError('Status must be a String').required('Status is Required'),
  type: Yup.string().typeError('Type must be a String').required('Type is Required')
});
exports.userSchema = userSchema;

var Form = function Form() {
  function filter(input, option) {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  return _react["default"].createElement(_formik.Formik, {
    initialValues: initialValue,
    validationSchema: userSchema,
    onSubmit: function onSubmit(values, _ref) {
      var setSubmitting = _ref.setSubmitting;
      console.log(values);
      var serve = new _serverService.OpenSRPService('https://opensrp-stage.smartregister.org/opensrp/rest', '/location');

      var payload = _objectSpread({}, values);

      serve.create(payload).then(function () {
        _antd.notification.success({
          message: 'User created successfully',
          description: ''
        });

        setSubmitting(false);

        _connectedReducerRegistry.history.goBack();
      })["catch"](function (e) {
        _antd.notification.error({
          message: "".concat(e),
          description: ''
        });

        setSubmitting(false);
      });
    }
  }, function (_ref2) {
    var errors = _ref2.errors,
        isSubmitting = _ref2.isSubmitting,
        handleSubmit = _ref2.handleSubmit;
    console.log('errors :', errors);
    return _react["default"].createElement(_formikAntd.Form, (0, _extends2["default"])({
      validateMessages: validateMessages,
      requiredMark: false
    }, layout, {
      onSubmitCapture: handleSubmit
    }), _react["default"].createElement(_formikAntd.Form.Item, {
      label: "Location Name",
      name: "name"
    }, _react["default"].createElement(_formikAntd.Select, {
      name: "name",
      showSearch: true,
      placeholder: "Enter a location group name",
      optionFilterProp: "children",
      filterOption: filter
    }, location.map(function (e) {
      return _react["default"].createElement(_formikAntd.Select.Option, {
        key: e.value,
        value: e.value
      }, e.name);
    }))), _react["default"].createElement(_formikAntd.Form.Item, {
      label: "Status",
      name: "status",
      valuePropName: "checked"
    }, _react["default"].createElement(_formikAntd.Radio.Group, {
      name: "status",
      defaultValue: initialValue.status
    }, status.map(function (e) {
      return _react["default"].createElement(_formikAntd.Radio, {
        name: "status",
        key: e.value,
        value: e.value
      }, e.label);
    }))), _react["default"].createElement(_formikAntd.Form.Item, {
      name: "type",
      label: "Type"
    }, _react["default"].createElement(_formikAntd.Input.TextArea, {
      name: "type",
      rows: 4,
      placeholder: "Description"
    })), _react["default"].createElement(_formikAntd.Form.Item, (0, _extends2["default"])({
      name: 'buttons'
    }, offsetLayout), _react["default"].createElement(_formikAntd.SubmitButton, null, isSubmitting ? 'Saving' : 'Save'), _react["default"].createElement(_formikAntd.ResetButton, {
      onClick: function onClick() {
        return _connectedReducerRegistry.history.goBack();
      }
    }, "Cancel")));
  });
};

exports.Form = Form;
var _default = Form;
exports["default"] = _default;