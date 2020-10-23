"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reducer = reducer;
exports.getKeycloakUsersById = getKeycloakUsersById;
exports.getKeycloakUsersArray = getKeycloakUsersArray;
exports.makeKeycloakUsersSelector = exports.getKeycloakUsersByIds = exports.getUsersByUsername = exports.getUsername = exports.getUserIds = exports.initialState = exports.removeKeycloakUsers = exports.fetchKeycloakUsers = exports.REMOVE_KEYCLOAK_USERS = exports.KEYCLOAK_USERS_FETCHED = exports.reducerName = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _fast_array_intersect = _interopRequireDefault(require("fast_array_intersect"));

var _reselect = require("reselect");

var _seamlessImmutable = _interopRequireDefault(require("seamless-immutable"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var reducerName = 'keycloakUsers';
exports.reducerName = reducerName;
var KEYCLOAK_USERS_FETCHED = 'keycloak/reducer/users/userS_FETCHED';
exports.KEYCLOAK_USERS_FETCHED = KEYCLOAK_USERS_FETCHED;
var REMOVE_KEYCLOAK_USERS = 'keycloak/reducer/users/REMOVE_KEYCLOAK_USERS';
exports.REMOVE_KEYCLOAK_USERS = REMOVE_KEYCLOAK_USERS;

var fetchKeycloakUsers = function fetchKeycloakUsers() {
  var usersList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return {
    usersById: (0, _lodash.keyBy)(usersList, function (user) {
      return user.id;
    }),
    type: KEYCLOAK_USERS_FETCHED
  };
};

exports.fetchKeycloakUsers = fetchKeycloakUsers;

var removeKeycloakUsers = function removeKeycloakUsers() {
  return {
    usersById: {},
    type: REMOVE_KEYCLOAK_USERS
  };
};

exports.removeKeycloakUsers = removeKeycloakUsers;
var initialState = (0, _seamlessImmutable["default"])({
  usersById: {}
});
exports.initialState = initialState;

function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case KEYCLOAK_USERS_FETCHED:
      return (0, _seamlessImmutable["default"])(_objectSpread(_objectSpread({}, state), {}, {
        usersById: _objectSpread(_objectSpread({}, state.usersById), action.usersById)
      }));

    case REMOVE_KEYCLOAK_USERS:
      return (0, _seamlessImmutable["default"])(_objectSpread(_objectSpread({}, state), {}, {
        usersById: action.usersById
      }));

    default:
      return state;
  }
}

var getUserIds = function getUserIds(_, props) {
  return props.id;
};

exports.getUserIds = getUserIds;

var getUsername = function getUsername(_, props) {
  return props.username;
};

exports.getUsername = getUsername;

function getKeycloakUsersById(state) {
  return state[reducerName].usersById;
}

function getKeycloakUsersArray(state) {
  return (0, _lodash.values)(getKeycloakUsersById(state));
}

var getUsersByUsername = function getUsersByUsername() {
  return (0, _reselect.createSelector)(getKeycloakUsersArray, getUsername, function (usersArray, username) {
    return username ? usersArray.filter(function (user) {
      return user.username.toLowerCase().includes(username.toLowerCase());
    }) : usersArray;
  });
};

exports.getUsersByUsername = getUsersByUsername;

var getKeycloakUsersByIds = function getKeycloakUsersByIds() {
  return (0, _reselect.createSelector)(getKeycloakUsersById, getUserIds, getKeycloakUsersArray, function (usersById, ids, usersArray) {
    if (ids === undefined) {
      return usersArray;
    }

    if (ids.length > 0) {
      return ids.map(function (id) {
        return usersById[id];
      });
    }

    return [];
  });
};

exports.getKeycloakUsersByIds = getKeycloakUsersByIds;

var makeKeycloakUsersSelector = function makeKeycloakUsersSelector() {
  return (0, _reselect.createSelector)(getKeycloakUsersByIds(), getUsersByUsername(), function (arr1, arr2) {
    return (0, _fast_array_intersect["default"])([arr1, arr2], JSON.stringify);
  });
};

exports.makeKeycloakUsersSelector = makeKeycloakUsersSelector;