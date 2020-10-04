"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectedAdminView = exports.Admin = exports.deleteUser = exports.defaultProps = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var React = _interopRequireWildcard(require("react"));

var _antd = require("antd");

var _keycloakService = require("@opensrp/keycloak-service");

var _reactRouterDom = require("react-router-dom");

var _connectedReducerRegistry = require("@onaio/connected-reducer-registry");

var _Loading = _interopRequireDefault(require("../components/Loading"));

var _HeaderBreadCrumb = _interopRequireDefault(require("./HeaderBreadCrumb"));

var _store = require("@opensrp/store");

var _reactRedux = require("react-redux");

var _reduxReducerRegistry = _interopRequireDefault(require("@onaio/redux-reducer-registry"));

_reduxReducerRegistry.default.register(_store.reducerName, _store.reducer);

var defaultProps = {
  accessToken: 'hunter 2',
  serviceClass: _keycloakService.KeycloakService,
  fetchKeycloakUsersCreator: _store.fetchKeycloakUsers,
  removeKeycloakUsersCreator: _store.removeKeycloakUsers,
  keycloakUsers: []
};
exports.defaultProps = defaultProps;

var deleteUser = function deleteUser(props, userId) {
  var serviceClass = props.serviceClass,
      fetchKeycloakUsersCreator = props.fetchKeycloakUsersCreator,
      removeKeycloakUsersCreator = props.removeKeycloakUsersCreator,
      accessToken = props.accessToken;
  var serviceDelete = new serviceClass(accessToken, "/users/".concat(userId), 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage');
  var serviceGet = new serviceClass(accessToken, '/users', 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage');
  serviceDelete.delete().then(function () {
    _antd.notification.success({
      message: 'User deleted successfully',
      description: ''
    });

    serviceGet.list().then(function (res) {
      removeKeycloakUsersCreator();
      fetchKeycloakUsersCreator(res);
    }).catch(function (_) {
      _antd.notification.error({
        message: 'An error occurred',
        description: ''
      });
    });
  }).catch(function (_) {
    _antd.notification.error({
      message: 'An error occurred',
      description: ''
    });
  });
};

exports.deleteUser = deleteUser;

var Admin = function Admin(props) {
  var _React$useState = React.useState(),
      _React$useState2 = (0, _slicedToArray2.default)(_React$useState, 2),
      filteredInfo = _React$useState2[0],
      setFilteredInfo = _React$useState2[1];

  var _React$useState3 = React.useState(),
      _React$useState4 = (0, _slicedToArray2.default)(_React$useState3, 2),
      sortedInfo = _React$useState4[0],
      setSortedInfo = _React$useState4[1];

  var _React$useState5 = React.useState(true),
      _React$useState6 = (0, _slicedToArray2.default)(_React$useState5, 2),
      isLoading = _React$useState6[0],
      setIsLoading = _React$useState6[1];

  var serviceClass = props.serviceClass,
      fetchKeycloakUsersCreator = props.fetchKeycloakUsersCreator,
      keycloakUsers = props.keycloakUsers,
      accessToken = props.accessToken;

  var handleChange = function handleChange(pagination, filters, sorter) {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  React.useEffect(function () {
    if (isLoading) {
      var serve = new serviceClass(accessToken, '/users', 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage');
      serve.list().then(function (res) {
        if (isLoading) {
          fetchKeycloakUsersCreator(res);
          setIsLoading(false);
        }
      }).catch(function (err) {
        _antd.notification.error({
          message: "".concat(err),
          description: ''
        });
      });
    }
  });

  if (isLoading) {
    return React.createElement(_Loading.default, null);
  }

  var headerItems = ['Username', 'Email', 'First Name', 'Last Name'];
  var dataElements = [];
  var fields = ['username', 'email', 'firstName', 'lastName'];
  fields.forEach(function (field, index) {
    var dataFilters = keycloakUsers.map(function (filteredUser) {
      return {
        text: filteredUser[field],
        value: filteredUser[field]
      };
    });
    dataElements.push({
      title: headerItems[index],
      dataIndex: fields[index],
      key: fields[index],
      filters: Array.from(new Set(dataFilters)),
      filteredValue: filteredInfo && filteredInfo[fields[index]] || null,
      onFilter: function onFilter(value, record) {
        return record[fields[index]].includes(value);
      },
      sorter: function sorter(a, b) {
        if (b[fields[index]]) {
          return a[fields[index]].length - b[fields[index]].length;
        }
      },
      sortOrder: sortedInfo && sortedInfo.columnKey === fields[index] && sortedInfo.order,
      ellipsis: true
    });
  });
  dataElements.push({
    title: 'Actions',
    dataIndex: 'actions',
    key: 'Actions',
    render: function render(_, record) {
      return React.createElement(React.Fragment, null, React.createElement(_reactRouterDom.Link, {
        to: "/user/edit/".concat(record.id),
        key: "actions"
      }, 'Edit'), React.createElement("span", null, "\xA0"), React.createElement("span", null, "\xA0"), React.createElement("span", null, "\xA0"), React.createElement("span", null, "\xA0"), React.createElement(_antd.Popconfirm, {
        title: "Are you sure delete this user?",
        okText: "Yes",
        cancelText: "No",
        onConfirm: function onConfirm() {
          return deleteUser(props, record.id);
        }
      }, React.createElement(_reactRouterDom.Link, {
        to: "#"
      }, 'Delete')));
    }
  });
  var tableData = keycloakUsers.map(function (user, index) {
    return {
      key: "".concat(index),
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };
  });
  return React.createElement(React.Fragment, null, React.createElement(_antd.Row, null, React.createElement(_antd.Col, {
    span: 12
  }, React.createElement(_antd.Space, null, React.createElement(_HeaderBreadCrumb.default, {
    isAdmin: true
  }), React.createElement(_antd.Divider, null))), React.createElement(_antd.Col, {
    span: 12,
    style: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, React.createElement(_antd.Space, {
    style: {
      marginBottom: 16,
      justifyContent: 'flex-end'
    }
  }, React.createElement(_antd.Button, {
    type: "primary",
    className: "create-user",
    onClick: function onClick() {
      return _connectedReducerRegistry.history.push('/user/new');
    }
  }, "Add User")))), React.createElement(_antd.Row, null, React.createElement(_antd.Table, {
    columns: dataElements,
    dataSource: tableData,
    pagination: {
      pageSize: 5
    },
    onChange: handleChange,
    bordered: true
  })));
};

exports.Admin = Admin;
Admin.defaultProps = defaultProps;

var mapStateToProps = function mapStateToProps(state, _) {
  var keycloakUsers = (0, _store.getKeycloakUsersArray)(state);
  var accessToken = (0, _store.getAccessToken)(state);
  return {
    keycloakUsers: keycloakUsers,
    accessToken: accessToken
  };
};

var mapDispatchToProps = {
  fetchKeycloakUsersCreator: _store.fetchKeycloakUsers,
  removeKeycloakUsersCreator: _store.removeKeycloakUsers
};
var ConnectedAdminView = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Admin);
exports.ConnectedAdminView = ConnectedAdminView;