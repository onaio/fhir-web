import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import React from 'react';
import { unstable_HistoryRouter as Router, Route, Routes } from 'react-router-dom';
import { useSearchParams } from '../useSearchParams';
import { prettyDOM } from '@testing-library/react';

const history = createMemoryHistory();

test('useSimpleSearch works correctly', () => {
  history.push('/qr');

  window.history.pushState({}, '', '/qr')

  const wrapper = ({ children }) => (
    <>
      <Router history={history}>
        <Routes>
          <Route path="/qr" element={children} />
        </Routes>
      </Router>
    </>
  );

  const {
    result: { current },
  } = renderHook(() => useSearchParams(), { wrapper });

  console.log(prettyDOM(document))

  console.log({ current })

  expect(current.sParams.toString()).toEqual('');
  const params = {
    key: 'value',
    key1: 'value1',
    key2: 'value2',
  };
  current.addParams(params);
  expect(current.sParams.toString()).toEqual('key=value&key1=value1&key2=value2');

  //Test that when we call addParams to an existing key we replace it instead of appending
  current.addParam('key1', 'newValue3');
  expect(current.sParams.toString()).toEqual('key=value&key1=newValue3&key2=value2');

  console.log(history.location)

  expect(history.location).toMatchObject({
    hash: '',
    key: expect.any(String),
    pathname: '/qr',
    search: '?key=value&key1=newValue3&key2=value2',
    // state: undefined,
  });

  current.removeParam('key1');
  expect(current.sParams.toString()).toEqual('key=value&key2=value2');
  expect(history.location).toMatchObject({
    hash: '',
    key: expect.any(String),
    pathname: '/qr',
    search: '?key=value&key2=value2',
    // state: undefined,
  });
});
