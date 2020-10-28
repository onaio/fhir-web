'use strict';

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.ConnectedUserList = exports.UserList = exports.defaultProps = void 0;

var _slicedToArray2 = _interopRequireDefault(require('@babel/runtime/helpers/slicedToArray'));

var React = _interopRequireWildcard(require('react'));

var _antd = require('antd');

var _keycloakService = require('@opensrp/keycloak-service');

var _connectedReducerRegistry = require('@onaio/connected-reducer-registry');

var _Loading = _interopRequireDefault(require('../Loading'));

var _HeaderBreadCrumb = _interopRequireDefault(require('../HeaderBreadCrumb'));

var _store = require('@opensrp/store');

var _reactRedux = require('react-redux');

var _reduxReducerRegistry = _interopRequireDefault(require('@onaio/redux-reducer-registry'));

var _constants = require('../../constants');

var _utils = require('./utils');

_reduxReducerRegistry['default'].register(_store.reducerName, _store.reducer);

var defaultProps = {
  accessToken: '',
  serviceClass: _keycloakService.KeycloakService,
  fetchKeycloakUsersCreator: _store.fetchKeycloakUsers,
  removeKeycloakUsersCreator: _store.removeKeycloakUsers,
  keycloakUsers: [],
  keycloakBaseURL: '',
};
exports.defaultProps = defaultProps;

var UserList = function UserList(props) {
  var _React$useState = React.useState(),
    _React$useState2 = (0, _slicedToArray2['default'])(_React$useState, 2),
    filteredInfo = _React$useState2[0],
    setFilteredInfo = _React$useState2[1];

  var _React$useState3 = React.useState(),
    _React$useState4 = (0, _slicedToArray2['default'])(_React$useState3, 2),
    sortedInfo = _React$useState4[0],
    setSortedInfo = _React$useState4[1];

  var _React$useState5 = React.useState(true),
    _React$useState6 = (0, _slicedToArray2['default'])(_React$useState5, 2),
    isLoading = _React$useState6[0],
    setIsLoading = _React$useState6[1];

  var serviceClass = props.serviceClass,
    fetchKeycloakUsersCreator = props.fetchKeycloakUsersCreator,
    removeKeycloakUsersCreator = props.removeKeycloakUsersCreator,
    keycloakUsers = props.keycloakUsers,
    accessToken = props.accessToken,
    keycloakBaseURL = props.keycloakBaseURL;

  var isLoadingCallback = function isLoadingCallback(isLoading) {
    setIsLoading(isLoading);
  };

  React.useEffect(function () {
    if (isLoading) {
      var serve = new serviceClass(accessToken, _constants.KEYCLOAK_URL_USERS, keycloakBaseURL);
      serve
        .list()
        .then(function (res) {
          if (isLoading) {
            setIsLoading(false);
            fetchKeycloakUsersCreator(res);
          }
        })
        ['catch'](function (err) {
          _antd.notification.error({
            message: ''.concat(err),
            description: '',
          });
        });
    }
  });

  if (isLoading) {
    return React.createElement(_Loading['default'], null);
  }

  var tableData = keycloakUsers.map(function (user, index) {
    return {
      key: ''.concat(index),
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  });
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      _antd.Row,
      null,
      React.createElement(
        _antd.Col,
        {
          span: 12,
        },
        React.createElement(
          _antd.Space,
          null,
          React.createElement(_HeaderBreadCrumb['default'], {
            isAdmin: true,
          }),
          React.createElement(_antd.Divider, null)
        )
      ),
      React.createElement(
        _antd.Col,
        {
          span: 12,
          style: {
            display: 'flex',
            justifyContent: 'flex-end',
          },
        },
        React.createElement(
          _antd.Space,
          {
            style: {
              marginBottom: 16,
              justifyContent: 'flex-end',
            },
          },
          React.createElement(
            _antd.Button,
            {
              type: 'primary',
              className: 'create-user',
              onClick: function onClick() {
                return _connectedReducerRegistry.history.push(_constants.URL_USER_CREATE);
              },
            },
            'Add User'
          )
        )
      )
    ),
    React.createElement(
      _antd.Row,
      null,
      React.createElement(_antd.Table, {
        columns: (0, _utils.getTableColumns)(
          keycloakUsers,
          removeKeycloakUsersCreator,
          accessToken,
          keycloakBaseURL,
          isLoadingCallback,
          filteredInfo,
          sortedInfo
        ),
        dataSource: tableData,
        pagination: {
          pageSize: 5,
        },
        onChange: function onChange(_, filters, sorter) {
          setFilteredInfo(filters);
          setSortedInfo(sorter);
        },
        bordered: true,
      })
    )
  );
};

exports.UserList = UserList;
UserList.defaultProps = defaultProps;

var mapStateToProps = function mapStateToProps(state, _) {
  var keycloakUsers = (0, _store.getKeycloakUsersArray)(state);
  var accessToken = (0, _store.getAccessToken)(state);
  return {
    keycloakUsers: keycloakUsers,
    accessToken: accessToken,
  };
};

var mapDispatchToProps = {
  fetchKeycloakUsersCreator: _store.fetchKeycloakUsers,
  removeKeycloakUsersCreator: _store.removeKeycloakUsers,
};
var ConnectedUserList = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(UserList);
exports.ConnectedUserList = ConnectedUserList;
