'use strict';

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.getTableColumns = exports.getDataFilters = void 0;

var React = _interopRequireWildcard(require('react'));

var _TableActions = require('./TableActions');

var getDataFilters = function getDataFilters(users, field) {
  return users.map(function (filteredUser) {
    return {
      text: filteredUser[field],
      value: filteredUser[field],
    };
  });
};

exports.getDataFilters = getDataFilters;

var getTableColumns = function getTableColumns(
  users,
  removeKeycloakUsersCreator,
  accessToken,
  keycloakBaseURL,
  isLoadingCallback,
  filteredInfo,
  sortedInfo
) {
  var headerItems = ['Username', 'Email', 'First Name', 'Last Name'];
  var dataElements = [];
  var fields = ['username', 'email', 'firstName', 'lastName'];
  fields.forEach(function (field, index) {
    var dataFilters = users.map(function (filteredUser) {
      return {
        text: filteredUser[field],
        value: filteredUser[field],
      };
    });
    dataElements.push({
      title: headerItems[index],
      dataIndex: fields[index],
      key: fields[index],
      filters: Array.from(new Set(dataFilters)),
      filteredValue: (filteredInfo && filteredInfo[fields[index]]) || null,
      onFilter: function onFilter(value, record) {
        return record[fields[index]].includes(value);
      },
      sorter: function sorter(a, b) {
        if (b[fields[index]]) {
          return a[fields[index]].length - b[fields[index]].length;
        }
      },
      sortOrder: sortedInfo && sortedInfo.columnKey === fields[index] && sortedInfo.order,
      ellipsis: true,
    });
  });
  dataElements.push({
    title: 'Actions',
    dataIndex: 'actions',
    key: 'Actions',
    render: function render(_, record) {
      var tableActionsProps = {
        removeKeycloakUsersCreator: removeKeycloakUsersCreator,
        accessToken: accessToken,
        keycloakBaseURL: keycloakBaseURL,
        isLoadingCallback: isLoadingCallback,
        record: record,
      };
      return React.createElement(_TableActions.TableActions, tableActionsProps);
    },
  });
  return dataElements;
};

exports.getTableColumns = getTableColumns;
