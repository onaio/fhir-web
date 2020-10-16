'use strict';

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = exports.HeaderBreadCrumb = void 0;

var _slicedToArray2 = _interopRequireDefault(require('@babel/runtime/helpers/slicedToArray'));

var React = _interopRequireWildcard(require('react'));

var _antd = require('antd');

var _connectedReducerRegistry = require('@onaio/connected-reducer-registry');

var TabPane = _antd.Tabs.TabPane;

var HeaderBreadCrumb = function HeaderBreadCrumb(props) {
  var userId = props.userId;

  var _React$useState = React.useState(''),
    _React$useState2 = (0, _slicedToArray2['default'])(_React$useState, 2),
    activeKey = _React$useState2[0],
    setActiveKey = _React$useState2[1];

  var handleTabLink = function handleTabLink(key) {
    if (key === 'credentials') {
      _connectedReducerRegistry.history.push('/user/credentials/'.concat(userId));
    } else if (key === 'details') {
      _connectedReducerRegistry.history.push('/user/edit/'.concat(userId));
    } else {
      _connectedReducerRegistry.history.push('/'.concat(key));
    }

    setActiveKey(key);
  };

  return !userId
    ? React.createElement(
        _antd.Tabs,
        {
          type: 'card',
          onChange: handleTabLink,
        },
        React.createElement(TabPane, {
          tab: 'Users',
          key: 'admin',
        })
      )
    : React.createElement(
        _antd.Tabs,
        {
          type: 'card',
          onChange: handleTabLink,
          activeKey: ''.concat(activeKey),
        },
        React.createElement(TabPane, {
          tab: 'Details',
          key: 'details',
        }),
        React.createElement(TabPane, {
          tab: 'Credentials',
          key: 'credentials',
        }),
        React.createElement(TabPane, {
          tab: 'Groups',
          key: 'groups',
        })
      );
};

exports.HeaderBreadCrumb = HeaderBreadCrumb;
var _default = HeaderBreadCrumb;
exports['default'] = _default;
