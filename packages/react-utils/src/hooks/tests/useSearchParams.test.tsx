import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router, Route, Switch } from 'react-router';
import { useSearchParams } from '../useSearchParams';

const history = createMemoryHistory();

test('useSimpleSearch works correctly', () => {
  history.push('/qr');

  const wrapper = ({ children }) => (
    <>
      <Router history={history}>
        <Switch>
          <Route exact path="/qr">
            <div>{children}</div>
          </Route>
        </Switch>
      </Router>
    </>
  );

  const {
    result: { current },
  } = renderHook(() => useSearchParams(), { wrapper });

  expect(current.sParams.toString()).toEqual('');
  current.addParam('key', 'value');
  current.addParam('key1', 'value1');
  current.addParam('key2', 'value2');
  expect(current.sParams.toString()).toEqual('key=value&key1=value1&key2=value2');

  //Test that when we call addParams to an existing key we replace it instead of appending
  current.addParam('key1', 'newValue3');
  expect(current.sParams.toString()).toEqual('key=value&key1=newValue3&key2=value2');

  expect(history.location).toMatchObject({
    hash: '',
    key: expect.any(String),
    pathname: '/qr',
    search:
      '?key=value?key=value&key1=value1?key=value&key1=value1&key2=value2?key=value&key1=newValue3&key2=value2',
    state: undefined,
  });

  current.removeParam('key1');
  expect(current.sParams.toString()).toEqual('key=value&key2=value2');
  expect(history.location).toMatchObject({
    hash: '',
    key: expect.any(String),
    pathname: '/qr',
    search:
      '?key=value?key=value&key1=value1?key=value&key1=value1&key2=value2?key=value&key1=newValue3&key2=value2?key=value&key2=value2',
    state: undefined,
  });
});
