"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectedCreateEditUser = exports.CreateEditUser = exports.defaultEditUserProps = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireDefault(require("react"));

var _antd = require("antd");

var _reactRedux = require("react-redux");

var _reduxReducerRegistry = _interopRequireDefault(require("@onaio/redux-reducer-registry"));

var _HeaderBreadCrumb = require("../HeaderBreadCrumb");

var _store = require("@opensrp/store");

var _keycloakService = require("@opensrp/keycloak-service");

var _UserForm = require("../forms/UserForm");

var _constants = require("../../constants");

var _user = require("../../ducks/user");

var _Loading = _interopRequireDefault(require("../Loading"));

require("../../index.css");

_reduxReducerRegistry["default"].register(_user.reducerName, _user.reducer);

var defaultEditUserProps = {
  accessToken: '',
  keycloakUser: null,
  serviceClass: _keycloakService.KeycloakService,
  keycloakBaseURL: '',
  fetchKeycloakUsersCreator: _user.fetchKeycloakUsers
};
exports.defaultEditUserProps = defaultEditUserProps;

var CreateEditUser = function CreateEditUser(props) {
  var _React$useState = _react["default"].useState(false),
      _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
      isLoading = _React$useState2[0],
      setIsLoading = _React$useState2[1];

  var keycloakUser = props.keycloakUser,
      accessToken = props.accessToken,
      keycloakBaseURL = props.keycloakBaseURL,
      serviceClass = props.serviceClass,
      fetchKeycloakUsersCreator = props.fetchKeycloakUsersCreator;
  var userId = props.match.params[_constants.ROUTE_PARAM_USER_ID];
  var initialValues = keycloakUser ? keycloakUser : _UserForm.defaultInitialValues;

  _react["default"].useEffect(function () {
    if (userId && !keycloakUser) {
      var serve = new serviceClass(accessToken, _constants.KEYCLOAK_URL_USERS, keycloakBaseURL);
      setIsLoading(true);
      serve.read(userId).then(function (response) {
        if (response) {
          setIsLoading(false);
          fetchKeycloakUsersCreator([response]);
        }
      })["catch"](function (_) {
        setIsLoading(false);

        _antd.notification.error({
          message: _constants.ERROR_OCCURED,
          description: ''
        });
      });
    }
  }, [accessToken, fetchKeycloakUsersCreator, serviceClass, userId, keycloakBaseURL, keycloakUser]);

  if (isLoading) {
    return _react["default"].createElement(_Loading["default"], null);
  }

  var userFormProps = {
    accessToken: accessToken,
    initialValues: initialValues,
    serviceClass: serviceClass,
    keycloakBaseURL: keycloakBaseURL
  };
  return _react["default"].createElement(_antd.Row, null, _react["default"].createElement(_antd.Col, {
    xs: 24,
    sm: 20,
    md: 18,
    lg: 15,
    xl: 12
  }, _react["default"].createElement(_HeaderBreadCrumb.HeaderBreadCrumb, {
    userId: userId
  }), _react["default"].createElement(_UserForm.UserForm, userFormProps)));
};

exports.CreateEditUser = CreateEditUser;
CreateEditUser.defaultProps = defaultEditUserProps;

var mapStateToProps = function mapStateToProps(state, ownProps) {
  var userId = ownProps.match.params[_constants.ROUTE_PARAM_USER_ID];
  var keycloakUser = null;

  if (userId) {
    var keycloakUsersSelector = (0, _user.makeKeycloakUsersSelector)();
    var keycloakUsers = keycloakUsersSelector(state, {
      id: [userId]
    });
    keycloakUser = keycloakUsers.length === 1 ? keycloakUsers[0] : null;
  }

  var accessToken = (0, _store.getAccessToken)(state);
  return {
    keycloakUser: keycloakUser,
    accessToken: accessToken
  };
};

var ConnectedCreateEditUser = (0, _reactRedux.connect)(mapStateToProps)(CreateEditUser);
exports.ConnectedCreateEditUser = ConnectedCreateEditUser;