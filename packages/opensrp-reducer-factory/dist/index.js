<<<<<<< HEAD
'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
=======
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
>>>>>>> master
});
exports.fetchActionCreatorFactory = fetchActionCreatorFactory;
exports.setTotalRecordsFactory = setTotalRecordsFactory;
exports.getTotalRecordsFactory = exports.getItemByIdFactory = exports.getItemsArrayFactory = exports.getItemsByIdFactory = exports.reducerFactory = exports.removeActionCreatorFactory = exports.SET_TOTAL_RECORDS = exports.REMOVE = exports.FETCHED = void 0;

<<<<<<< HEAD
var _defineProperty2 = _interopRequireDefault(require('@babel/runtime/helpers/defineProperty'));

var _lodash = require('lodash');

var _seamlessImmutable = _interopRequireDefault(require('seamless-immutable'));

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        (0, _defineProperty2['default'])(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
=======
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _seamlessImmutable = _interopRequireDefault(require("seamless-immutable"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
>>>>>>> master

var FETCHED = 'opensrp/reducer/objects/FETCHED';
exports.FETCHED = FETCHED;
var REMOVE = 'opensrp/reducer/objects/REMOVE';
exports.REMOVE = REMOVE;
var SET_TOTAL_RECORDS = 'opensrp/reducer/objects/SET_TOTAL_RECORDS';
exports.SET_TOTAL_RECORDS = SET_TOTAL_RECORDS;

function fetchActionCreatorFactory(reducerName, idField) {
  return function () {
    var objectsList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return {
      objectsById: (0, _lodash.keyBy)(objectsList, function (object) {
        return object[idField];
      }),
      type: FETCHED,
<<<<<<< HEAD
      reducerName: reducerName,
=======
      reducerName: reducerName
>>>>>>> master
    };
  };
}

var removeActionCreatorFactory = function removeActionCreatorFactory(reducerName) {
  return function () {
    return {
      objectsById: {},
      type: REMOVE,
<<<<<<< HEAD
      reducerName: reducerName,
=======
      reducerName: reducerName
>>>>>>> master
    };
  };
};

exports.removeActionCreatorFactory = removeActionCreatorFactory;

function setTotalRecordsFactory(reducerName) {
  return function (totalCount) {
    return {
      totalRecords: totalCount,
      type: SET_TOTAL_RECORDS,
<<<<<<< HEAD
      reducerName: reducerName,
=======
      reducerName: reducerName
>>>>>>> master
    };
  };
}

<<<<<<< HEAD
var initialState = (0, _seamlessImmutable['default'])({
  objectsById: {},
  totalRecords: 0,
});

var reducerFactory = function reducerFactory(reducerName) {
  var fetchedActionType =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : FETCHED;
  var removeActionType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : REMOVE;
  var setTotalRecordsActionType =
    arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : SET_TOTAL_RECORDS;
=======
var initialState = (0, _seamlessImmutable["default"])({
  objectsById: {},
  totalRecords: 0
});

var reducerFactory = function reducerFactory(reducerName) {
  var fetchedActionType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : FETCHED;
  var removeActionType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : REMOVE;
  var setTotalRecordsActionType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : SET_TOTAL_RECORDS;
>>>>>>> master
  return function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var actionReducerName = action.reducerName;

    if (reducerName !== actionReducerName) {
      return state;
    }

    exports.FETCHED = FETCHED = fetchedActionType;
    exports.REMOVE = REMOVE = removeActionType;
    exports.SET_TOTAL_RECORDS = SET_TOTAL_RECORDS = setTotalRecordsActionType;

    switch (action.type) {
      case FETCHED:
<<<<<<< HEAD
        return (0, _seamlessImmutable['default'])(
          _objectSpread(
            _objectSpread({}, state),
            {},
            {
              objectsById: _objectSpread(_objectSpread({}, state.objectsById), action.objectsById),
            }
          )
        );

      case REMOVE:
        return (0, _seamlessImmutable['default'])(
          _objectSpread(
            _objectSpread({}, state),
            {},
            {
              objectsById: action.objectsById,
            }
          )
        );

      case SET_TOTAL_RECORDS:
        return (0, _seamlessImmutable['default'])(
          _objectSpread(
            _objectSpread({}, state),
            {},
            {
              totalRecords: action.totalRecords,
            }
          )
        );
=======
        return (0, _seamlessImmutable["default"])(_objectSpread(_objectSpread({}, state), {}, {
          objectsById: _objectSpread(_objectSpread({}, state.objectsById), action.objectsById)
        }));

      case REMOVE:
        return (0, _seamlessImmutable["default"])(_objectSpread(_objectSpread({}, state), {}, {
          objectsById: action.objectsById
        }));

      case SET_TOTAL_RECORDS:
        return (0, _seamlessImmutable["default"])(_objectSpread(_objectSpread({}, state), {}, {
          totalRecords: action.totalRecords
        }));
>>>>>>> master

      default:
        return state;
    }
  };
};

exports.reducerFactory = reducerFactory;

var getItemsByIdFactory = function getItemsByIdFactory(reducerName) {
  return function (state) {
    return state[reducerName].objectsById;
  };
};

exports.getItemsByIdFactory = getItemsByIdFactory;

var getItemsArrayFactory = function getItemsArrayFactory(reducerName) {
  return function (state) {
    var getItemsById = getItemsByIdFactory(reducerName);
    return (0, _lodash.values)(getItemsById(state));
  };
};

exports.getItemsArrayFactory = getItemsArrayFactory;

var getItemByIdFactory = function getItemByIdFactory(reducerName) {
  return function (state, id) {
    return (0, _lodash.get)(getItemsByIdFactory(reducerName)(state), id) || null;
  };
};

exports.getItemByIdFactory = getItemByIdFactory;

var getTotalRecordsFactory = function getTotalRecordsFactory(reducerName) {
  return function (state) {
    return state[reducerName].totalRecords;
  };
};

<<<<<<< HEAD
exports.getTotalRecordsFactory = getTotalRecordsFactory;
=======
exports.getTotalRecordsFactory = getTotalRecordsFactory;
>>>>>>> master
