'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.deleteUser = void 0;

var _antd = require('antd');

var _keycloakService = require('@opensrp/keycloak-service');

var _constants = require('../../../constants');

var deleteUser = function deleteUser(
  fetchKeycloakUsersCreator,
  removeKeycloakUsersCreator,
  accessToken,
  keycloakBaseURL,
  userId
) {
  var serviceDelete = new _keycloakService.KeycloakService(
    accessToken,
    ''.concat(_constants.KEYCLOAK_URL_USERS, '/').concat(userId),
    keycloakBaseURL
  );
  serviceDelete['delete']()
    .then(function () {
      _antd.notification.success({
        message: ''.concat(_constants.USER_DELETED_SUCCESSFULLY),
        description: '',
      });

      var serviceGet = new _keycloakService.KeycloakService(
        accessToken,
        _constants.KEYCLOAK_URL_USERS,
        keycloakBaseURL
      );
      serviceGet
        .list()
        .then(function (res) {
          removeKeycloakUsersCreator();
          fetchKeycloakUsersCreator(res);
        })
        ['catch'](function (_) {
          _antd.notification.error({
            message: ''.concat(_constants.ERROR_OCCURED),
            description: '',
          });
        });
    })
    ['catch'](function (_) {
      _antd.notification.error({
        message: ''.concat(_constants.ERROR_OCCURED),
        description: '',
      });
    });
};

exports.deleteUser = deleteUser;
