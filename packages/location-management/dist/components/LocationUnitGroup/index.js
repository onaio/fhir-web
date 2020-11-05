"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectedLocationUnitGroupAdd = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireWildcard(require("react"));

var _reactHelmet = require("react-helmet");

var _antd = require("antd");

var _icons = require("@ant-design/icons");

var _serverService = require("@opensrp/server-service");

var _sessionReducer = require("@onaio/session-reducer");

var _loaders = require("@onaio/loaders");

var _reactRedux = require("react-redux");

require("../Location.css");

var _LocationDetail = _interopRequireDefault(require("../LocationDetail"));

var _constants = require("../../constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var tableData = [];

var EditableCell = function EditableCell(_ref) {
  var props = (0, _extends2["default"])({}, _ref);
  var editing = props.editing,
      dataIndex = props.dataIndex,
      title = props.title,
      inputType = props.inputType,
      record = props.record,
      index = props.index,
      children = props.children,
      restProps = (0, _objectWithoutProperties2["default"])(props, ["editing", "dataIndex", "title", "inputType", "record", "index", "children"]);
  return _react["default"].createElement("td", restProps, children);
};

var LocationUnitGroup = function LocationUnitGroup(props) {
  var accessToken = props.accessToken;

  var _Form$useForm = _antd.Form.useForm(),
      _Form$useForm2 = (0, _slicedToArray2["default"])(_Form$useForm, 1),
      form = _Form$useForm2[0];

  var _useState = (0, _react.useState)(tableData),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      data = _useState2[0],
      setData = _useState2[1];

  var _useState3 = (0, _react.useState)(tableData),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      filter = _useState4[0],
      setfilterData = _useState4[1];

  var _useState5 = (0, _react.useState)(''),
      _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
      value = _useState6[0],
      setValue = _useState6[1];

  var _useState7 = (0, _react.useState)(null),
      _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
      selectedLocation = _useState8[0],
      setSelectedLocation = _useState8[1];

  var _React$useState = _react["default"].useState(true),
      _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
      isLoading = _React$useState2[0],
      setIsLoading = _React$useState2[1];

  (0, _react.useEffect)(function () {
    setIsLoading(true);
    var clientService = new _serverService.OpenSRPService(accessToken, _constants.KEYCLOAK_API_BASE_URL, _constants.URL_ALL_LOCATION_TAGS);
    clientService.list().then(function (res) {
      setData(res);
      setfilterData(res);
      setIsLoading(false);
    })["catch"](function (err) {
      setIsLoading(false);

      _antd.notification.error({
        message: "".concat(err),
        description: ''
      });
    });
  }, []);

  var edit = function edit() {};

  var onRemoveHandler = function onRemoveHandler(record) {
    var clientService = new _serverService.OpenSRPService(accessToken, _constants.KEYCLOAK_API_BASE_URL, _constants.URL_DELETE_LOCATION_TAGS + "/".concat(record.id));
    clientService["delete"]().then(function (res) {
      setIsLoading(false);

      _antd.notification.success({
        message: 'Successfully Deleted!',
        description: ''
      });
    })["catch"](function (err) {
      setIsLoading(false);

      _antd.notification.error({
        message: "".concat(err),
        description: ''
      });
    });
  };

  var onViewDetail = function onViewDetail(record) {
    var clientService = new _serverService.OpenSRPService(accessToken, _constants.KEYCLOAK_API_BASE_URL, _constants.URL_ALL_LOCATION_TAGS + "/".concat(record.id));
    clientService.list().then(function (res) {
      setIsLoading(false);
      console.log(res);
      setSelectedLocation(res);
    })["catch"](function (err) {
      setIsLoading(false);

      _antd.notification.error({
        message: "".concat(err),
        description: ''
      });
    });
  };

  var cancel = function cancel() {};

  var columns = [{
    title: 'Name',
    dataIndex: 'name',
    editable: true,
    sorter: function sorter(a, b) {
      return a.name.localeCompare(b.name);
    }
  }, {
    title: 'Actions',
    dataIndex: 'operation',
    width: '10%',
    render: function render(_, record) {
      return _react["default"].createElement("span", {
        className: "location-table-action"
      }, _react["default"].createElement("p", {
        className: "edit",
        onClick: function onClick() {
          return edit();
        }
      }, "Edit"), _react["default"].createElement(_antd.Dropdown, {
        overlay: _react["default"].createElement(_antd.Menu, null, _react["default"].createElement(_antd.Menu.Item, {
          onClick: function onClick() {
            onViewDetail(record);
          }
        }, "View Details")),
        placement: "bottomLeft",
        arrow: true,
        trigger: ['click']
      }, _react["default"].createElement(_icons.MoreOutlined, {
        className: "more-options"
      })));
    }
  }];
  var mergedColumns = columns.map(function (col) {
    if (!col.editable) return col;
    return _objectSpread(_objectSpread({}, col), {}, {
      onCell: function onCell(record) {
        return {
          record: record,
          inputType: col.dataIndex === 'level' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title
        };
      }
    });
  });

  var onChange = function onChange(e) {
    var currentValue = e.target.value;
    setValue(currentValue);
    console.log('currentValue', currentValue, length);
    console.log('setData', data);
    var filteredData = data.filter(function (entry) {
      return entry.name.toLowerCase().includes(currentValue.toLowerCase());
    });
    setfilterData(filteredData);
  };

  if (isLoading) {
    return _react["default"].createElement(_loaders.Ripple, null);
  }

  return _react["default"].createElement("section", null, _react["default"].createElement(_reactHelmet.Helmet, null, _react["default"].createElement("title", null, "Locations Unit")), _react["default"].createElement(_antd.Row, {
    justify: "start",
    className: "weclome-box"
  }, _react["default"].createElement(_antd.Col, {
    span: 24
  }, _react["default"].createElement("h5", null, "Location Unit Group Management"))), _react["default"].createElement(_antd.Row, null, _react["default"].createElement(_antd.Col, {
    span: selectedLocation !== null ? 16 : 24
  }, _react["default"].createElement(_antd.Row, {
    className: "bg-white"
  }, _react["default"].createElement(_antd.Col, {
    span: 24
  }, _react["default"].createElement("div", {
    className: "mb-3 mt-3 mr-1 ml-3 d-flex justify-content-between"
  }, _react["default"].createElement("h5", null, _react["default"].createElement(_antd.Input, {
    placeholder: "Search",
    size: "large",
    value: value,
    prefix: _react["default"].createElement(_icons.SearchOutlined, null),
    onChange: onChange
  })), _react["default"].createElement("div", null, _react["default"].createElement(_antd.Button, {
    type: "primary"
  }, _react["default"].createElement(_icons.PlusOutlined, null), "Add location unit group"), _react["default"].createElement(_antd.Divider, {
    type: "vertical"
  }), _react["default"].createElement(_antd.Dropdown, {
    overlay: _react["default"].createElement(_antd.Menu, null, _react["default"].createElement(_antd.Menu.Item, {
      key: '1'
    }, "Logout")),
    placement: "bottomRight"
  }, _react["default"].createElement(_antd.Button, {
    shape: "circle",
    icon: _react["default"].createElement(_icons.SettingOutlined, null),
    type: "text"
  })))), _react["default"].createElement("div", {
    className: "table-container"
  }, _react["default"].createElement(_antd.Form, {
    form: form,
    component: false
  }, _react["default"].createElement(_antd.Table, {
    components: {
      body: {
        cell: EditableCell
      }
    },
    dataSource: value.length < 1 ? data : filter,
    columns: mergedColumns,
    rowClassName: "editable-row",
    pagination: {
      onChange: cancel,
      showQuickJumper: true
    }
  })))))), selectedLocation !== null ? _react["default"].createElement(_antd.Col, {
    className: "pl-3 border-left",
    span: 8
  }, _react["default"].createElement(_LocationDetail["default"], (0, _extends2["default"])({
    onClose: function onClose() {
      return setSelectedLocation(null);
    }
  }, selectedLocation))) : null));
};

var mapStateToProps = function mapStateToProps(state) {
  var accessToken = (0, _sessionReducer.getAccessToken)(state);
  return {
    accessToken: accessToken
  };
};

var ConnectedLocationUnitGroupAdd = (0, _reactRedux.connect)(mapStateToProps, null)(LocationUnitGroup);
exports.ConnectedLocationUnitGroupAdd = ConnectedLocationUnitGroupAdd;