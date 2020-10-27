"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Form = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _formik = require("formik");

var _react = _interopRequireDefault(require("react"));

var _antd = require("antd");

var _connectedReducerRegistry = require("@onaio/connected-reducer-registry");

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

var Form = function Form() {
  function filter(input, option) {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  return _react["default"].createElement(_formik.Formik, {
    initialValues: initialValue,
    onSubmit: function onSubmit(values, _ref) {
      var setSubmitting = _ref.setSubmitting;
      console.log('asd', values);
      setSubmitting(false);
    }
  }, function (_ref2) {
    var errors = _ref2.errors,
        isSubmitting = _ref2.isSubmitting,
        handleSubmit = _ref2.handleSubmit;
    console.log('errors :', errors);
    console.log('isSubmitting :', isSubmitting);
    return _react["default"].createElement(_antd.Form, (0, _extends2["default"])({
      validateMessages: validateMessages,
      requiredMark: false,
      initialValues: initialValue
    }, layout, {
      onSubmitCapture: handleSubmit
    }), _react["default"].createElement(_antd.Form.Item, {
      label: "Location Name",
      name: "name",
      rules: [{
        required: true,
        whitespace: true
      }]
    }, _react["default"].createElement(_antd.Select, {
      showSearch: true,
      placeholder: "Enter a location group name",
      optionFilterProp: "children",
      filterOption: filter
    }, location.map(function (e) {
      return _react["default"].createElement(_antd.Select.Option, {
        key: e.value,
        value: e.value
      }, e.name);
    }))), _react["default"].createElement(_antd.Form.Item, {
      label: "Status",
      name: "status",
      valuePropName: "checked",
      rules: [{
        required: true
      }]
    }, _react["default"].createElement(_antd.Radio.Group, {
      defaultValue: initialValue.status
    }, status.map(function (e) {
      return _react["default"].createElement(_antd.Radio, {
        key: e.value,
        value: e.value
      }, e.label);
    }))), _react["default"].createElement(_antd.Form.Item, {
      name: "type",
      label: "Type",
      rules: [{
        required: true,
        whitespace: true
      }]
    }, _react["default"].createElement(_antd.Input.TextArea, {
      rows: 4,
      placeholder: "Description"
    })), _react["default"].createElement(_antd.Form.Item, offsetLayout, _react["default"].createElement(_antd.Button, {
      type: "primary",
      htmlType: "submit",
      loading: isSubmitting,
      disabled: Object.keys(errors).length > 0
    }, isSubmitting ? 'Saving' : 'Save'), _react["default"].createElement(_antd.Button, {
      htmlType: "submit",
      onClick: function onClick() {
        return _connectedReducerRegistry.history.goBack();
      }
    }, "Cancel")));
  });
};

exports.Form = Form;
var _default = Form;
exports["default"] = _default;