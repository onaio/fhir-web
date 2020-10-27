'use strict';

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.ConnectedCreateEditUser = exports.CreateEditUser = exports.userSchema = exports.defaultEditUserProps = exports.defaultInitialValues = void 0;

var _react = _interopRequireDefault(require('react'));

var _antd = require('antd');

var Yup = _interopRequireWildcard(require('yup'));

var _reactRedux = require('react-redux');

var _reduxReducerRegistry = _interopRequireDefault(require('@onaio/redux-reducer-registry'));

var _HeaderBreadCrumb = require('../HeaderBreadCrumb');

var _store = require('@opensrp/store');

var _keycloakService = require('@opensrp/keycloak-service');

var _UserForm = require('../forms/UserForm');

var _constants = require('../../constants');

require('../../index.css');

_reduxReducerRegistry['default'].register(_store.reducerName, _store.reducer);

var defaultInitialValues = {
  access: {
    manageGroupMembership: false,
    view: false,
    mapRoles: false,
    impersonate: false,
    manage: false,
  },
  createdTimestamp: undefined,
  disableableCredentialTypes: [],
  email: '',
  emailVerified: false,
  enabled: true,
  firstName: '',
  id: '',
  lastName: '',
  notBefore: 0,
  requiredActions: [],
  totp: false,
  username: '',
};
exports.defaultInitialValues = defaultInitialValues;
var defaultEditUserProps = {
  accessToken: '',
  keycloakUser: null,
  serviceClass: _keycloakService.KeycloakService,
  keycloakBaseURL: '',
};
exports.defaultEditUserProps = defaultEditUserProps;
var userSchema = Yup.object().shape({
  lastName: Yup.string().required('Required'),
  firstName: Yup.string().required('Required'),
});
exports.userSchema = userSchema;

var CreateEditUser = function CreateEditUser(props) {
  var keycloakUser = props.keycloakUser,
    accessToken = props.accessToken,
    keycloakBaseURL = props.keycloakBaseURL;
  var userId = props.match.params[_constants.ROUTE_PARAM_USER_ID];
  var isEditMode = !!userId;
  var initialValues = isEditMode ? keycloakUser : defaultInitialValues;
  var userFormProps = {
    accessToken: accessToken,
    initialValues: initialValues,
    serviceClass: _keycloakService.KeycloakService,
    keycloakBaseURL: keycloakBaseURL,
  };
  return _react['default'].createElement(
    _antd.Row,
    null,
    _react['default'].createElement(
      _antd.Col,
      {
        xs: 24,
        sm: 20,
        md: 18,
        lg: 15,
        xl: 12,
      },
      _react['default'].createElement(_HeaderBreadCrumb.HeaderBreadCrumb, {
        userId: userId,
      }),
      _react['default'].createElement(_UserForm.UserForm, userFormProps)
    )
  );
};

exports.CreateEditUser = CreateEditUser;
CreateEditUser.defaultProps = defaultEditUserProps;

var mapStateToProps = function mapStateToProps(state, ownProps) {
  var userId = ownProps.match.params[_constants.ROUTE_PARAM_USER_ID];
  var keycloakUser = null;

  if (userId) {
    var keycloakUsersSelector = (0, _store.makeKeycloakUsersSelector)();
    var keycloakUsers = keycloakUsersSelector(state, {
      id: [userId],
    });
    keycloakUser = keycloakUsers.length === 1 ? keycloakUsers[0] : null;
  }

  var accessToken = (0, _store.getAccessToken)(state);
  return {
    keycloakUser: keycloakUser,
    accessToken: accessToken,
  };
};

var ConnectedCreateEditUser = (0, _reactRedux.connect)(mapStateToProps)(CreateEditUser);
exports.ConnectedCreateEditUser = ConnectedCreateEditUser;
