'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.fetchRequiredActions = exports.submitForm = void 0;

var _antd = require('antd');

var _connectedReducerRegistry = require('@onaio/connected-reducer-registry');

var _constants = require('../../constants');

var submitForm = function submitForm(
  values,
  accessToken,
  keycloakBaseURL,
  keycloakServiceClass,
  setSubmitting,
  userId
) {
  setSubmitting(true);

  if (userId) {
    var serve = new keycloakServiceClass(
      accessToken,
      ''.concat(_constants.KEYCLOAK_URL_USERS, '/').concat(userId),
      keycloakBaseURL
    );
    serve
      .update(values)
      .then(function () {
        setSubmitting(false);

        _connectedReducerRegistry.history.push(_constants.URL_ADMIN);

        _antd.notification.success({
          message: 'User edited successfully',
          description: '',
        });
      })
      ['catch'](function (e) {
        setSubmitting(false);

        _antd.notification.error({
          message: ''.concat(e),
          description: '',
        });
      });
  } else {
    var _serve = new keycloakServiceClass(
      accessToken,
      _constants.KEYCLOAK_URL_USERS,
      keycloakBaseURL
    );

    _serve
      .create(values)
      .then(function () {
        setSubmitting(false);

        _connectedReducerRegistry.history.push(_constants.URL_ADMIN);

        _antd.notification.success({
          message: 'User created successfully',
          description: '',
        });
      })
      ['catch'](function (e) {
        setSubmitting(false);

        _antd.notification.error({
          message: ''.concat(e),
          description: '',
        });
      });
  }
};

exports.submitForm = submitForm;

var fetchRequiredActions = function fetchRequiredActions(
  accessToken,
  keycloakBaseURL,
  setUserActionOptions,
  keycloakServiceClass
) {
  var keycloakService = new keycloakServiceClass(
    accessToken,
    _constants.KEYCLOAK_URL_REQUIRED_USER_ACTIONS,
    keycloakBaseURL
  );
  keycloakService
    .list()
    .then(function (response) {
      setUserActionOptions(
        response.filter(function (action) {
          return action.alias !== 'terms_and_conditions';
        })
      );
    })
    ['catch'](function (err) {
      _antd.notification.error({
        message: ''.concat(err),
        description: '',
      });
    });
};

exports.fetchRequiredActions = fetchRequiredActions;
