'use strict';

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.TableActions = void 0;

var React = _interopRequireWildcard(require('react'));

var _antd = require('antd');

var _utils = require('./utils');

var _reactRouterDom = require('react-router-dom');

var _constants = require('../../../constants');

var TableActions = function TableActions(props) {
  var record = props.record,
    fetchKeycloakUsersCreator = props.fetchKeycloakUsersCreator,
    removeKeycloakUsersCreator = props.removeKeycloakUsersCreator,
    accessToken = props.accessToken,
    keycloakBaseURL = props.keycloakBaseURL;
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      _antd.Space,
      {
        size: 'middle',
      },
      React.createElement(
        _reactRouterDom.Link,
        {
          to: ''.concat(_constants.URL_USER_EDIT, '/').concat(record.id),
          key: 'actions',
        },
        'Edit'
      ),
      React.createElement(
        _antd.Popconfirm,
        {
          title: 'Are you sure delete this user?',
          okText: 'Yes',
          cancelText: 'No',
          onConfirm: function onConfirm() {
            return (0, _utils.deleteUser)(
              fetchKeycloakUsersCreator,
              removeKeycloakUsersCreator,
              accessToken,
              keycloakBaseURL,
              record.id
            );
          },
        },
        React.createElement(
          _reactRouterDom.Link,
          {
            to: '#',
          },
          'Delete'
        )
      )
    )
  );
};

exports.TableActions = TableActions;
