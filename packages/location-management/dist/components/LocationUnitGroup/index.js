"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectedLocationUnitGroupAdd = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireWildcard(require("react"));

var _reactHelmet = require("react-helmet");

var _antd = require("antd");

var _icons = require("@ant-design/icons");

var _reactRedux = require("react-redux");

require("../Location.css");

var _LocationDetail = _interopRequireDefault(require("../LocationDetail"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var tableData = [];

for (var i = 0; i < 100; i++) {
  tableData.push({
    key: i.toString(),
    name: "Edrward ".concat(i),
    level: 2,
    lastupdated: new Date(),
    status: 'Alive',
    type: 'Feautire',
    created: new Date(),
    externalid: "externalid ".concat(i),
    openmrsid: "openmrsid ".concat(i),
    username: "edward".concat(i),
    version: "".concat(i),
    syncstatus: 'Synced'
  });
}

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
  return _react["default"].createElement("td", restProps, editing ? _react["default"].createElement(_antd.Form.Item, {
    name: dataIndex,
    style: {
      margin: 0
    },
    rules: [{
      required: true,
      message: "Please Input ".concat(title, "!")
    }]
  }, _react["default"].createElement(_antd.Input, null)) : children);
};

var LocationUnitGroup = function LocationUnitGroup() {
  var _Form$useForm = _antd.Form.useForm(),
      _Form$useForm2 = (0, _slicedToArray2["default"])(_Form$useForm, 1),
      form = _Form$useForm2[0];

  var _useState = (0, _react.useState)(tableData),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      data = _useState2[0],
      setData = _useState2[1];

  var _useState3 = (0, _react.useState)(''),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      editingKey = _useState4[0],
      setEditingKey = _useState4[1];

  var _useState5 = (0, _react.useState)(''),
      _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
      value = _useState6[0],
      setValue = _useState6[1];

  var _useState7 = (0, _react.useState)(null),
      _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
      selectedLocation = _useState8[0],
      setSelectedLocation = _useState8[1];

  var isEditing = function isEditing(record) {
    return record.key === editingKey;
  };

  var edit = function edit(record) {
    form.setFieldsValue(_objectSpread({}, record));
    setEditingKey(record.key);
  };

  var cancel = function cancel() {
    return setEditingKey('');
  };

  var save = function () {
    var _ref2 = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(key) {
      var row, newData, index, item;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return form.validateFields();

            case 3:
              row = _context.sent;
              newData = (0, _toConsumableArray2["default"])(data);
              index = newData.findIndex(function (item) {
                return key === item.key;
              });

              if (index > -1) {
                item = newData[index];
                newData.splice(index, 1, _objectSpread(_objectSpread({}, item), row));
                setData(newData);
                setEditingKey('');
              } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
              }

              _context.next = 11;
              break;

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](0);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 9]]);
    }));

    return function save(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

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
      var editable = isEditing(record);
      return editable ? _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement(_antd.Button, {
        type: "link",
        className: "p-1",
        onClick: function onClick() {
          return save(record.key);
        }
      }, "Save"), _react["default"].createElement(_antd.Button, {
        type: "link",
        className: "p-1",
        onClick: function onClick() {
          return cancel();
        }
      }, "Cancel")) : _react["default"].createElement("span", {
        className: "location-table-action"
      }, _react["default"].createElement("p", {
        className: "edit",
        onClick: function onClick() {
          return edit(record);
        }
      }, "Edit"), _react["default"].createElement(_antd.Dropdown, {
        overlay: _react["default"].createElement(_antd.Menu, null, _react["default"].createElement(_antd.Menu.Item, {
          onClick: function onClick() {
            setSelectedLocation(record);
          }
        }, "View Details"), _react["default"].createElement(_antd.Menu.Item, null, _react["default"].createElement(_antd.Popconfirm, {
          title: "Sure to Delete?",
          onConfirm: function onConfirm() {
            return console.log('');
          }
        }, "Delete"))),
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
          title: col.title,
          editing: isEditing(record)
        };
      }
    });
  });

  var onChange = function onChange(e) {
    var currentValue = e.target.value;
    setValue(currentValue);
    var filteredData = tableData.filter(function (entry) {
      return entry.name.toLowerCase().includes(currentValue.toLowerCase());
    });
    setData(filteredData);
  };

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
    dataSource: data,
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

var ConnectedLocationUnitGroupAdd = (0, _reactRedux.connect)(null, null)(LocationUnitGroup);
exports.ConnectedLocationUnitGroupAdd = ConnectedLocationUnitGroupAdd;