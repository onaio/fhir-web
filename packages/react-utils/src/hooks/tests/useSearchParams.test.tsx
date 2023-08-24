import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { MemoryRouter as Router, Route, Routes } from 'react-router';
import { useSearchParams } from '../useSearchParams';

test('useSimpleSearch works correctly', () => {
  const wrapper = ({ children }) => (
    <>
      <Router initialEntries={['/qr']}>
        <Routes>
          <Route path="/qr" element={children} />
        </Routes>
      </Router>
    </>
  );

  const {
    result: { current },
  } = renderHook(() => useSearchParams(), { wrapper });
  
  console.log(window.location)

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
