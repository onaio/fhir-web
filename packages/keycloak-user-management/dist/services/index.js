"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultHeaders = getDefaultHeaders;
exports.getFilterParams = getFilterParams;
exports.getPayloadOptions = getPayloadOptions;
exports.KeycloakService = exports.OpenSRPService = exports.KEYCLOAK_API_BASE_URL = exports.OPENSRP_API_BASE_URL = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _serverService = require("@opensrp/server-service");

var _keycloak = require("./keycloak");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var OPENSRP_API_BASE_URL = 'https://opensrp-stage.smartregister.org/opensrp/rest/';
exports.OPENSRP_API_BASE_URL = OPENSRP_API_BASE_URL;
var KEYCLOAK_API_BASE_URL = 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage';
exports.KEYCLOAK_API_BASE_URL = KEYCLOAK_API_BASE_URL;

function getDefaultHeaders() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'hunter2';
  var accept = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'application/json';
  var authorizationType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Bearer';
  var contentType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'application/json;charset=UTF-8';
  return {
    accept: accept,
    authorization: "".concat(authorizationType, " ").concat(accessToken),
    'content-type': contentType
  };
}

function getFilterParams(obj) {
  return Object.entries(obj).map(function (_ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
        key = _ref2[0],
        val = _ref2[1];

    return "".concat(key, ":").concat(val);
  }).join(',');
}

function getPayloadOptions(_, method) {
  return {
    headers: getDefaultHeaders(),
    method: method
  };
}

var OpenSRPService = function (_OpenSRPServiceWeb) {
  (0, _inherits2.default)(OpenSRPService, _OpenSRPServiceWeb);

  var _super = _createSuper(OpenSRPService);

  function OpenSRPService() {
    var baseURL = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : OPENSRP_API_BASE_URL;
    var endpoint = arguments.length > 1 ? arguments[1] : undefined;
    var getPayload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : getPayloadOptions;
    (0, _classCallCheck2.default)(this, OpenSRPService);
    return _super.call(this, baseURL, endpoint, getPayload);
  }

  (0, _createClass2.default)(OpenSRPService, [{
    key: "readFile",
    value: function () {
      var _readFile = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(id) {
        var params,
            method,
            url,
            response,
            _args = arguments;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                params = _args.length > 1 && _args[1] !== undefined ? _args[1] : null;
                method = _args.length > 2 && _args[2] !== undefined ? _args[2] : 'GET';
                url = OpenSRPService.getURL("".concat(this.generalURL, "/").concat(id), params);
                _context.next = 5;
                return fetch(url, this.getOptions(this.signal, method));

              case 5:
                response = _context.sent;

                if (response.ok) {
                  _context.next = 8;
                  break;
                }

                throw new Error("OpenSRPService read on ".concat(this.endpoint, " failed, HTTP status ").concat(response.status));

              case 8:
                _context.next = 10;
                return response.blob();

              case 10:
                return _context.abrupt("return", _context.sent);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function readFile(_x) {
        return _readFile.apply(this, arguments);
      }

      return readFile;
    }()
  }]);
  return OpenSRPService;
}(_serverService.OpenSRPService);

exports.OpenSRPService = OpenSRPService;

var KeycloakService = function (_KeycloakAPIService) {
  (0, _inherits2.default)(KeycloakService, _KeycloakAPIService);

  var _super2 = _createSuper(KeycloakService);

  function KeycloakService() {
    var baseURL = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : KEYCLOAK_API_BASE_URL;
    var endpoint = arguments.length > 1 ? arguments[1] : undefined;
    var getPayload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : getPayloadOptions;
    (0, _classCallCheck2.default)(this, KeycloakService);
    return _super2.call(this, baseURL, endpoint, getPayload);
  }

  (0, _createClass2.default)(KeycloakService, [{
    key: "readFile",
    value: function () {
      var _readFile2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(id) {
        var params,
            method,
            url,
            response,
            _args2 = arguments;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                params = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : null;
                method = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : 'GET';
                url = KeycloakService.getURL("".concat(this.generalURL, "/").concat(id), params);
                _context2.next = 5;
                return fetch(url, this.getOptions(this.signal, method));

              case 5:
                response = _context2.sent;

                if (response.ok) {
                  _context2.next = 8;
                  break;
                }

                throw new Error("KeycloakService read on ".concat(this.endpoint, " failed, HTTP status ").concat(response.status));

              case 8:
                _context2.next = 10;
                return response.blob();

              case 10:
                return _context2.abrupt("return", _context2.sent);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function readFile(_x2) {
        return _readFile2.apply(this, arguments);
      }

      return readFile;
    }()
  }]);
  return KeycloakService;
}(_keycloak.KeycloakAPIService);

exports.KeycloakService = KeycloakService;