"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throwNetworkError = exports.throwHTTPError = exports.NetworkError = exports.HTTPError = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

var BaseError = function (_Error) {
  (0, _inherits2["default"])(BaseError, _Error);

  function BaseError() {
    var _this;

    (0, _classCallCheck2["default"])(this, BaseError);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(BaseError).call(this));
    _this.name = _this.constructor.name;
    return _this;
  }

  return BaseError;
}((0, _wrapNativeSuper2["default"])(Error));

var HTTPError = function (_BaseError) {
  (0, _inherits2["default"])(HTTPError, _BaseError);

  function HTTPError(response, object, serviceDescription) {
    var _this2;

    (0, _classCallCheck2["default"])(this, HTTPError);
    _this2 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(HTTPError).call(this));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "statusCode", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "statusText", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "url", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "description", void 0);
    _this2.statusCode = response.status;
    _this2.statusText = response.statusText;
    _this2.description = object;
    _this2.url = response.url;

    if (serviceDescription) {
      _this2.message = serviceDescription;
    }

    return _this2;
  }

  return HTTPError;
}(BaseError);

exports.HTTPError = HTTPError;

var NetworkError = function (_BaseError2) {
  (0, _inherits2["default"])(NetworkError, _BaseError2);

  function NetworkError() {
    (0, _classCallCheck2["default"])(this, NetworkError);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(NetworkError).call(this));
  }

  return NetworkError;
}(BaseError);

exports.NetworkError = NetworkError;

var throwHTTPError = function () {
  var _ref = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(response, customMessage) {
    var responseClone1;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            responseClone1 = response.clone();
            _context.next = 3;
            return responseClone1.text().then(function (apiErrRes) {
              throw new HTTPError(response, apiErrRes, customMessage);
            });

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function throwHTTPError(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.throwHTTPError = throwHTTPError;

var throwNetworkError = function throwNetworkError(err) {
  if (err.name === 'TypeError') {
    throw new NetworkError();
  }

  throw err;
};

exports.throwNetworkError = throwNetworkError;