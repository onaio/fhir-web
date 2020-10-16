'use strict';

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.store = void 0;

var _connectedReducerRegistry = require('@onaio/connected-reducer-registry');

var _gatekeeper = require('@onaio/gatekeeper');

var _reduxReducerRegistry = _interopRequireWildcard(require('@onaio/redux-reducer-registry'));

var _sessionReducer = _interopRequireWildcard(require('@onaio/session-reducer'));

var defaultReducers = {
  router: _connectedReducerRegistry.connectReducer,
};
var preloadedState = window.__PRELOADED_STATE__ || {};
delete window.__PRELOADED_STATE__;
defaultReducers[_sessionReducer.reducerName] = _sessionReducer['default'];
defaultReducers[_gatekeeper.gateKeeperReducerName] = _gatekeeper.gateKeeperReducer;
var store = (0, _connectedReducerRegistry.getConnectedStore)(defaultReducers, preloadedState);
exports.store = store;

_reduxReducerRegistry['default'].setChangeListener(function (reducers) {
  store.replaceReducer((0, _reduxReducerRegistry.combine)(reducers));
});
