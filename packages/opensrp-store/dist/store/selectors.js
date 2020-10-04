"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApiToken = getApiToken;
exports.getAccessToken = getAccessToken;
exports.getOauthProviderState = getOauthProviderState;

var _sessionReducer = require("@onaio/session-reducer");

function getApiToken(state) {
  var extraData = state[_sessionReducer.reducerName].extraData;
  return extraData.api_token || null;
}

function getAccessToken(state) {
  var extraData = state[_sessionReducer.reducerName].extraData;

  if (extraData.oAuth2Data && extraData.oAuth2Data.access_token) {
    return extraData.oAuth2Data.access_token;
  }

  return null;
}

function getOauthProviderState(state) {
  var extraData = state[_sessionReducer.reducerName].extraData;

  if (extraData.oAuth2Data && extraData.oAuth2Data.state) {
    return extraData.oAuth2Data.state;
  }

  return null;
}